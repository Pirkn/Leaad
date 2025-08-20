from flask.views import MethodView
from flask_smorest import Blueprint
from flask import jsonify, request, g, current_app, Response
from dotenv import load_dotenv
from src.utils.auth import verify_supabase_token
from supabase import create_client, Client
import os
import base64
import hashlib
import hmac
import json
import uuid
from datetime import datetime, timedelta, timezone

load_dotenv(override=True)

blp = Blueprint('Subscriptions', __name__, description='Subscription and PayTR Operations')


def _get_supabase_client() -> Client:
    supabase_url = current_app.config['SUPABASE_URL']
    supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
    return create_client(supabase_url, supabase_key)


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _calculate_paytr_token(hash_str: str) -> str:
    merchant_key = os.getenv('PAYTR_MERCHANT_KEY', '').encode()
    merchant_salt = os.getenv('PAYTR_MERCHANT_SALT', '').encode()
    token = base64.b64encode(hmac.new(merchant_key, hash_str.encode() + merchant_salt, hashlib.sha256).digest())
    return token.decode()


def _capi_list_fetch_ctoken(utoken: str):
    try:
        merchant_id = os.getenv('PAYTR_MERCHANT_ID', '')
        merchant_key = os.getenv('PAYTR_MERCHANT_KEY', '').encode()
        merchant_salt = os.getenv('PAYTR_MERCHANT_SALT', '')
        if not (merchant_id and merchant_key and merchant_salt and utoken):
            print("[PAYTR CAPI LIST] Missing credentials or utoken")
            return None

        # paytr_token = base64(hmac_sha256(merchant_key, (utoken + merchant_salt)))
        hash_str = utoken + merchant_salt
        paytr_token = base64.b64encode(hmac.new(merchant_key, hash_str.encode(), hashlib.sha256).digest()).decode()

        payload = {
            'merchant_id': merchant_id,
            'utoken': utoken,
            'paytr_token': paytr_token
        }

        import requests
        r = requests.post('https://www.paytr.com/odeme/capi/list', data=payload, timeout=20)
        try:
            res = r.json()
        except Exception:
            print(f"[PAYTR CAPI LIST] Non-JSON response: {r.text[:400]}")
            return None

        # Expected: either {status:error, err_msg:..} OR list of card dicts OR dict with ctoken
        if isinstance(res, dict):
            if res.get('status') == 'error':
                print(f"[PAYTR CAPI LIST] Error: {res.get('err_msg')}")
                return None
            if 'ctoken' in res and res['ctoken']:
                return res['ctoken']
            # Some gateways return {'data':[...]} style; try to dig
            data = res.get('data')
            if isinstance(data, list) and data:
                first = data[0]
                if isinstance(first, dict) and first.get('ctoken'):
                    return first['ctoken']
        elif isinstance(res, list) and res:
            first = res[0]
            if isinstance(first, dict) and first.get('ctoken'):
                return first['ctoken']

        print(f"[PAYTR CAPI LIST] No ctoken in response: {res}")
        return None
    except Exception as e:
        print(f"[PAYTR CAPI LIST] Exception: {e}")
        return None


def _get_client_ip() -> str:
    # Try to get real client IP; allow override via request JSON 'user_ip'
    forwarded = request.headers.get('X-Forwarded-For', '')
    if forwarded:
        ip = forwarded.split(',')[0].strip()
    else:
        ip = request.remote_addr or ''
    return ip


def _is_private_or_empty_ip(ip: str) -> bool:
    if not ip:
        return True
    try:
        # Simple checks for local ranges
        return (
            ip.startswith('127.') or ip.startswith('10.') or
            ip.startswith('192.168.') or ip.startswith('169.254.') or
            ip.startswith('::1') or ip == '0.0.0.0'
        )
    except Exception:
        return True


def _resolve_public_ip(fallback_ip: str) -> str:
    if not _is_private_or_empty_ip(fallback_ip):
        return fallback_ip
    try:
        import requests
        r = requests.get('https://api.ipify.org?format=json', timeout=5)
        j = r.json()
        ip = j.get('ip')
        if isinstance(ip, str) and not _is_private_or_empty_ip(ip):
            return ip
    except Exception as e:
        print(f"[PAYTR] Failed to resolve public IP: {e}")
    return fallback_ip


@blp.route('/subscriptions/start-trial')
class StartTrial(MethodView):
    @verify_supabase_token
    def post(self):
        try:
            data = request.get_json() or {}

            uid = g.current_user['id']
            user_email = g.current_user.get('email') or data.get('email') or ''

            # Required billing fields for PayTR form
            user_name = data.get('user_name')
            user_address = data.get('user_address')
            user_phone = data.get('user_phone')
            if not all([user_name, user_address, user_phone]):
                return jsonify({'error': 'Missing required fields: user_name, user_address, user_phone'}), 400

            # Env and defaults
            merchant_id = os.getenv('PAYTR_MERCHANT_ID', '')
            test_mode = os.getenv('PAYTR_TEST_MODE', '1')
            # 3D is required per callback failed_code=10; use 3D for verification
            non_3d = '0'
            client_lang = 'tr'
            currency = 'TL'
            payment_type = 'card'
            installment_count = '0'
            payment_amount = '1.00'  # verification amount
            merchant_ok_url = os.getenv('PAYTR_OK_URL', 'http://localhost:5173/success')
            merchant_fail_url = os.getenv('PAYTR_FAIL_URL', 'http://localhost:5173/failure')

            user_ip_in = data.get('user_ip') or _get_client_ip() or ''
            user_ip = _resolve_public_ip(user_ip_in)
            merchant_oid = 'VERIF' + uuid.uuid4().hex[:24]

            # Minimal basket for verification
            user_basket = json.dumps([["Verification charge", payment_amount, 1]])

            # In test mode, PayTR test emails
            if test_mode == '1':
                user_email = 'test@paytr.com' if non_3d == '0' else 'testnon3d@paytr.com'

            # Build hash_str per PayTR docs
            hash_str = (
                merchant_id + user_ip + merchant_oid + user_email + payment_amount + payment_type +
                installment_count + currency + test_mode + non_3d
            )
            paytr_token = _calculate_paytr_token(hash_str)

            # Debug log for start-trial
            try:
                print(
                    f"[PAYTR START-TRIAL] oid={merchant_oid} ip_in={user_ip_in} ip_used={user_ip} amount={payment_amount} "
                    f"test_mode={test_mode} non_3d={non_3d} email={user_email} token_len={len(paytr_token)}"
                )
            except Exception:
                pass

            # Log intent in payment_logs (status wait_callback)
            supabase = _get_supabase_client()
            try:
                supabase.table('payment_logs').insert({
                    'uid': uid,
                    'merchant_oid': merchant_oid,
                    'amount': float(payment_amount),
                    'currency': currency,
                    'type': 'verification',
                    'status': 'wait_callback',
                    'raw_payload': None
                }).execute()
            except Exception as e:
                print(f"Failed to log verification intent: {e}")

            # Do not create trial until verification is successful in callback

            # Return fields for frontend form post to PayTR
            fields = {
                'merchant_id': merchant_id,
                'paytr_token': paytr_token,
                'user_ip': user_ip,
                'merchant_oid': merchant_oid,
                'email': user_email,
                'payment_type': payment_type,
                'payment_amount': payment_amount,
                'installment_count': installment_count,
                'currency': currency,
                'client_lang': client_lang,
                'test_mode': test_mode,
                'non_3d': non_3d,
                'non3d_test_failed': '0' if test_mode == '1' else '0',
                'merchant_ok_url': merchant_ok_url,
                'merchant_fail_url': merchant_fail_url,
                'user_name': user_name,
                'user_address': user_address,
                'user_phone': user_phone,
                'user_basket': user_basket,
                'debug_on': '1' if test_mode == '1' else '0',
                'store_card': '1',
                'utoken': ''
            }

            return jsonify({'post_url': 'https://www.paytr.com/odeme', 'fields': fields})
        except Exception as e:
            print(f"Error in start-trial: {e}")
            return jsonify({'error': 'Internal server error'}), 500


@blp.route('/api/paytr/callback')
class PaytrCallback(MethodView):
    def post(self):
        try:
            post = request.form or request.json or {}

            # Required callback fields
            merchant_oid = post.get('merchant_oid', '')
            status = post.get('status', '')
            total_amount = post.get('total_amount', '')
            received_hash = post.get('hash', '')
            failed_reason_code = post.get('failed_reason_code')
            failed_reason_msg = post.get('failed_reason_msg')

            merchant_key = os.getenv('PAYTR_MERCHANT_KEY', '').encode()
            merchant_salt = os.getenv('PAYTR_MERCHANT_SALT', '')

            hash_str = merchant_oid + merchant_salt + status + total_amount
            expected = base64.b64encode(hmac.new(merchant_key, hash_str.encode(), hashlib.sha256).digest()).decode()

            # Debug log for callback
            try:
                print(
                    f"[PAYTR CALLBACK] oid={merchant_oid} status={status} total_amount={total_amount} "
                    f"received_hash_len={len(received_hash or '')} failed_code={failed_reason_code} failed_msg={failed_reason_msg}"
                )
            except Exception:
                pass

            if expected != received_hash:
                # Do not reveal details; return non-OK so PayTR retries
                try:
                    print(
                        f"[PAYTR CALLBACK] BAD HASH oid={merchant_oid} expected_len={len(expected)} "
                        f"received_len={len(received_hash or '')}"
                    )
                except Exception:
                    pass
                return Response('PAYTR notification failed: bad hash', status=400, mimetype='text/plain')

            supabase = _get_supabase_client()

            # Try to map merchant_oid to user via payment_logs
            uid = None
            try:
                log_res = supabase.table('payment_logs').select('*').eq('merchant_oid', merchant_oid).execute()
                if log_res.data:
                    uid = log_res.data[0]['uid']
            except Exception as e:
                print(f"Error fetching payment log for merchant_oid {merchant_oid}: {e}")

            # Save utoken/ctoken if provided (card saved)
            utoken = post.get('utoken') or None
            ctoken = post.get('ctoken') or None

            try:
                print(
                    f"[PAYTR CALLBACK] oid={merchant_oid} utoken_present={bool(utoken)} ctoken_present={bool(ctoken)}"
                )
            except Exception:
                pass

            if status == 'success':
                # Update payment log
                try:
                    supabase.table('payment_logs').update({
                        'status': 'success',
                        'raw_payload': json.dumps(dict(post))
                    }).eq('merchant_oid', merchant_oid).execute()
                except Exception as e:
                    print(f"Failed to update payment log: {e}")

                if uid:
                    try:
                        existing = supabase.table('subscriptions').select('*').eq('uid', uid).execute().data
                        if merchant_oid.startswith('VERIF'):
                            # Verification payment succeeded → start trial and save tokens
                            trial_end = (datetime.now(timezone.utc) + timedelta(days=3)).isoformat()
                            if not existing:
                                supabase.table('subscriptions').insert({
                                    'uid': uid,
                                    'status': 'trial',
                                    'utoken': utoken,
                                    'ctoken': ctoken,
                                    'current_period_end': trial_end,
                                    'last_payment_status': 'success'
                                }).execute()
                            else:
                                update = {
                                    'status': 'trial',
                                    'last_payment_status': 'success',
                                    'current_period_end': trial_end,
                                    'updated_at': _now_iso()
                                }
                                if utoken:
                                    update['utoken'] = utoken
                                if ctoken:
                                    update['ctoken'] = ctoken
                                supabase.table('subscriptions').update(update).eq('uid', uid).execute()

                            # If ctoken missing, attempt CAPI LIST to fetch
                            if utoken and not (ctoken and len(str(ctoken)) > 0):
                                fetched_ctoken = _capi_list_fetch_ctoken(utoken)
                                if fetched_ctoken:
                                    try:
                                        supabase.table('subscriptions').update({
                                            'ctoken': fetched_ctoken,
                                            'updated_at': _now_iso()
                                        }).eq('uid', uid).execute()
                                        print(f"[PAYTR CAPI LIST] Stored ctoken for uid={uid}")
                                    except Exception as e:
                                        print(f"[PAYTR CAPI LIST] Failed to store ctoken: {e}")
                        else:
                            # Recurring payment succeeded → extend period + set active
                            new_end = (datetime.now(timezone.utc) + timedelta(days=30)).isoformat()
                            if not existing:
                                supabase.table('subscriptions').insert({
                                    'uid': uid,
                                    'status': 'active',
                                    'current_period_end': new_end,
                                    'last_payment_status': 'success'
                                }).execute()
                            else:
                                supabase.table('subscriptions').update({
                                    'status': 'active',
                                    'current_period_end': new_end,
                                    'last_payment_status': 'success',
                                    'updated_at': _now_iso()
                                }).eq('uid', uid).execute()
                    except Exception as e:
                        print(f"Failed to upsert subscription post-callback: {e}")
            else:
                # failed
                try:
                    supabase.table('payment_logs').update({
                        'status': 'failed',
                        'raw_payload': json.dumps(dict(post))
                    }).eq('merchant_oid', merchant_oid).execute()
                except Exception as e:
                    print(f"Failed to update failed payment log: {e}")

                # If recurring charge failed → cancel access
                if uid and not merchant_oid.startswith('VERIF'):
                    try:
                        supabase.table('subscriptions').update({
                            'status': 'canceled',
                            'last_payment_status': 'failed',
                            'updated_at': _now_iso()
                        }).eq('uid', uid).execute()
                    except Exception as e:
                        print(f"Failed to cancel subscription on failure: {e}")

            # Always return OK upon successful processing so PayTR stops retrying
            return Response('OK', status=200, mimetype='text/plain')
        except Exception as e:
            print(f"Callback error: {e}")
            # Non-OK to let PayTR retry if our server errored
            return Response('ERROR', status=500, mimetype='text/plain')


@blp.route('/subscriptions/cancel')
class CancelSubscription(MethodView):
    @verify_supabase_token
    def post(self):
        try:
            uid = g.current_user['id']
            supabase = _get_supabase_client()
            res = supabase.table('subscriptions').update({
                'status': 'canceled',
                'updated_at': _now_iso()
            }).eq('uid', uid).execute()
            return jsonify({'message': 'Subscription canceled', 'data': res.data})
        except Exception as e:
            print(f"Cancel subscription error: {e}")
            return jsonify({'error': 'Internal server error'}), 500


@blp.route('/subscriptions/charge')
class ProcessCharges(MethodView):
    def post(self):
        try:
            cron_key = request.headers.get('X-CRON-KEY')
            expected = os.getenv('CRON_TOKEN')
            if not expected or cron_key != expected:
                return jsonify({'error': 'Unauthorized'}), 401

            supabase = _get_supabase_client()

            # Config
            merchant_id = os.getenv('PAYTR_MERCHANT_ID', '')
            test_mode = os.getenv('PAYTR_TEST_MODE', '1')
            non_3d = '1'
            client_lang = 'tr'
            currency = 'TL'
            payment_type = 'card'
            installment_count = '0'
            payment_amount = '780.00'
            merchant_ok_url = os.getenv('PAYTR_OK_URL', 'http://localhost:5173/success')
            merchant_fail_url = os.getenv('PAYTR_FAIL_URL', 'http://localhost:5173/failure')

            now_iso = _now_iso()

            # Find due trials to convert and active renewals
            due_trials = supabase.table('subscriptions').select('*').eq('status', 'trial').lte('current_period_end', now_iso).execute().data or []
            due_active = supabase.table('subscriptions').select('*').eq('status', 'active').lte('current_period_end', now_iso).execute().data or []
            due = due_trials + due_active

            results = []
            for sub in due:
                utoken = sub.get('utoken')
                ctoken = sub.get('ctoken')
                uid = sub.get('uid')

                if not utoken or not ctoken:
                    # Cannot charge without tokens; cancel subscription
                    try:
                        supabase.table('subscriptions').update({
                            'status': 'canceled',
                            'updated_at': _now_iso()
                        }).eq('uid', uid).execute()
                    except Exception as e:
                        print(f"Failed to cancel missing-token sub for {uid}: {e}")
                    results.append({'uid': uid, 'status': 'canceled', 'reason': 'missing tokens'})
                    continue

                merchant_oid = 'SUB' + uuid.uuid4().hex[:24]

                # Minimal basket for subscription
                user_basket = json.dumps([["PRO Subscription (30 days)", payment_amount, 1]])

                # Email/name/address/phone are not stored; use placeholders
                email = 'test@paytr.com' if test_mode == '1' else ''
                user_name = 'Subscriber'
                user_address = 'N/A'
                user_phone = '0000000000'

                # Resolve public IP for recurring as required by PayTR
                user_ip = _resolve_public_ip(_get_client_ip() or '')

                hash_str = (
                    merchant_id + user_ip + merchant_oid + email + payment_amount + payment_type +
                    installment_count + currency + test_mode + non_3d
                )
                paytr_token = _calculate_paytr_token(hash_str)

                payload = {
                    'merchant_id': merchant_id,
                    'paytr_token': paytr_token,
                    'user_ip': user_ip,
                    'merchant_oid': merchant_oid,
                    'email': email,
                    'payment_type': payment_type,
                    'payment_amount': payment_amount,
                    'installment_count': installment_count,
                    'currency': currency,
                    'client_lang': client_lang,
                    'test_mode': test_mode,
                    'non_3d': non_3d,
                    'non3d_test_failed': '0' if test_mode == '1' else '0',
                    'merchant_ok_url': merchant_ok_url,
                    'merchant_fail_url': merchant_fail_url,
                    'user_name': user_name,
                    'user_address': user_address,
                    'user_phone': user_phone,
                    'user_basket': user_basket,
                    'debug_on': '1' if test_mode == '1' else '0',
                    'utoken': utoken,
                    'ctoken': ctoken,
                    'recurring_payment': '1'
                }

                # Log attempt
                try:
                    supabase.table('payment_logs').insert({
                        'uid': uid,
                        'merchant_oid': merchant_oid,
                        'amount': float(payment_amount),
                        'currency': currency,
                        'type': 'recurring',
                        'status': 'wait_callback',
                        'raw_payload': json.dumps(payload)
                    }).execute()
                except Exception as e:
                    print(f"Failed to log recurring attempt: {e}")

                # Send request to PayTR (server-to-server)
                import requests
                try:
                    resp = requests.post('https://www.paytr.com/odeme', data=payload, timeout=30)
                    try:
                        res_json = resp.json()
                    except Exception:
                        # Debug raw response text for troubleshooting
                        print(f"[PAYTR RECURRING RESP NON-JSON] oid={merchant_oid} text={resp.text[:500]}")
                        res_json = {'status': 'unknown', 'raw': resp.text}

                    status_res = res_json.get('status') or res_json.get('Status') or 'wait_callback'
                    msg_res = res_json.get('msg') or res_json.get('message')
                    try_again = res_json.get('try_again')
                    print(f"[PAYTR RECURRING RESP] oid={merchant_oid} status={status_res} msg={msg_res} try_again={try_again}")

                    if status_res == 'success':
                        # Immediate success (uncommon); extend period
                        supabase.table('subscriptions').update({
                            'status': 'active',
                            'current_period_end': (datetime.now(timezone.utc) + timedelta(days=30)).isoformat(),
                            'last_payment_status': 'success',
                            'updated_at': _now_iso()
                        }).eq('uid', uid).execute()
                        supabase.table('payment_logs').update({
                            'status': 'success',
                            'raw_payload': json.dumps({'response': res_json})
                        }).eq('merchant_oid', merchant_oid).execute()
                        results.append({'uid': uid, 'result': 'success'})
                    elif status_res == 'failed':
                        supabase.table('subscriptions').update({
                            'status': 'canceled',
                            'last_payment_status': 'failed',
                            'updated_at': _now_iso()
                        }).eq('uid', uid).execute()
                        supabase.table('payment_logs').update({
                            'status': 'failed',
                            'raw_payload': json.dumps({'response': res_json})
                        }).eq('merchant_oid', merchant_oid).execute()
                        results.append({'uid': uid, 'result': 'failed'})
                    else:
                        # wait_callback → final result via callback
                        results.append({'uid': uid, 'result': 'wait_callback'})
                except Exception as e:
                    print(f"Recurring charge request error for {uid}: {e}")
                    supabase.table('subscriptions').update({
                        'status': 'canceled',
                        'last_payment_status': 'failed',
                        'updated_at': _now_iso()
                    }).eq('uid', uid).execute()
                    results.append({'uid': uid, 'result': 'error'})

            return jsonify({'processed': len(due), 'results': results})
        except Exception as e:
            print(f"Process charges error: {e}")
            return jsonify({'error': 'Internal server error'}), 500


@blp.route('/subscriptions/me')
class GetMySubscription(MethodView):
    @verify_supabase_token
    def get(self):
        try:
            uid = g.current_user['id']
            supabase = _get_supabase_client()
            result = supabase.table('subscriptions').select('*').eq('uid', uid).execute()
            if result.data:
                return jsonify(result.data[0])
            return jsonify({'status': 'none'})
        except Exception as e:
            print(f"Get subscription error: {e}")
            return jsonify({'error': 'Internal server error'}), 500


@blp.route('/subscriptions/payment-logs')
class GetMyPaymentLogs(MethodView):
    @verify_supabase_token
    def get(self):
        try:
            uid = g.current_user['id']
            # Optional pagination params
            try:
                limit = int(request.args.get('limit', '50'))
                limit = max(1, min(limit, 200))
            except Exception:
                limit = 50

            supabase = _get_supabase_client()
            result = (
                supabase
                .table('payment_logs')
                .select('*')
                .eq('uid', uid)
                .order('created_at', desc=True)
                .execute()
            )
            data = result.data or []
            return jsonify(data[:limit])
        except Exception as e:
            print(f"Get payment logs error: {e}")
            return jsonify({'error': 'Internal server error'}), 500



import secrets
import time

import jwt
import pytest
from flask import Flask, g, jsonify

from src.utils.auth import SUPABASE_JWT_SECRET, verify_supabase_token

# Long-lived service token for CI smoke tests (expires 2035)
CI_SERVICE_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjaS1zZXJ2aWNlLWFjY291bnQiLCJlbWFpbCI6ImNpQGxlYWFkLmRldiIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiaWF0IjoxNzU5OTY4MDAwLCJleHAiOjIwNTEyMjI0MDB9.ywuqEckFFk-JBiTgKCUmzB8u3IhSM_rlxYFszL7ElpI"


@pytest.fixture
def client():
    app = Flask(__name__)

    @app.route("/protected")
    @verify_supabase_token
    def protected():
        return jsonify(g.current_user)

    return app.test_client()


def make_token(secret=SUPABASE_JWT_SECRET, **overrides):
    claims = {
        "sub": "user-123",
        "email": "demo@example.com",
        "aud": "authenticated",
        "exp": int(time.time()) + 3600,
    }
    claims.update(overrides)
    return jwt.encode(claims, secret, algorithm="HS256")


def test_missing_header_is_rejected(client):
    res = client.get("/protected")
    assert res.status_code == 401


def test_valid_token_sets_current_user(client):
    res = client.get("/protected", headers={"Authorization": f"Bearer {make_token()}"})
    assert res.status_code == 200
    assert res.get_json()["id"] == "user-123"


def test_expired_token_is_rejected(client):
    token = make_token(exp=int(time.time()) - 10)
    res = client.get("/protected", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 401


def test_token_signed_with_wrong_secret_is_rejected(client):
    token = make_token(secret=secrets.token_hex(32))
    res = client.get("/protected", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 401


def test_wrong_audience_is_rejected(client):
    token = make_token(aud="anon")
    res = client.get("/protected", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 401


def test_ci_service_token_is_accepted(client):
    res = client.get("/protected", headers={"Authorization": f"Bearer {CI_SERVICE_TOKEN}"})
    assert res.status_code == 200
    assert res.get_json()["role"] == "service_role"

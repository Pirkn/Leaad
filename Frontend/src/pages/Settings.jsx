import { User, AlertTriangle, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
// import { useNavigate } from "react-router-dom";

function Settings() {
  const { user, signOut } = useAuth();
  // const navigate = useNavigate();

  const [sub, setSub] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", address: "", phone: "" });
  const [paytrFields, setPaytrFields] = useState(null);
  const [postUrl, setPostUrl] = useState("");
  const [card, setCard] = useState({ owner: "", number: "", month: "", year: "", cvv: "" });

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const getUserInitials = (email) => {
    if (!email) return "U";
    return email.charAt(0).toUpperCase();
  };

  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.user_metadata?.name) {
      return user.user_metadata.name;
    }
    return user?.email?.split("@")[0] || "User";
  };

  const statusLabel = useMemo(() => {
    if (!sub) return "none";
    return sub.status || "none";
  }, [sub]);

  async function refresh() {
    try {
      const [s, l] = await Promise.all([
        api.getMySubscription(),
        api.getMyPaymentLogs(20),
      ]);
      setSub(s);
      setLogs(Array.isArray(l) ? l : []);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleStartTrial(e) {
    e.preventDefault();
    setLoading(true);
    try {
      // Get public IP for PayTR requirement on local tests
      let user_ip = "";
      try {
        const ipRes = await fetch("https://api.ipify.org?format=json");
        const ipJson = await ipRes.json();
        user_ip = ipJson?.ip || "";
      } catch {}

      const res = await api.startTrial({
        user_name: form.name,
        user_address: form.address,
        user_phone: form.phone,
        user_ip,
      });
      const { post_url, fields } = res;
      setPostUrl(post_url);
      setPaytrFields(fields);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    setLoading(true);
    try {
      await api.cancelSubscription();
      await refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function submitPaytrForm(e) {
    e.preventDefault();
    if (!paytrFields || !postUrl) return;
    const formEl = document.createElement("form");
    formEl.method = "POST";
    formEl.action = postUrl;
    // Hidden fields returned by backend
    Object.entries(paytrFields).forEach(([k, v]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = k;
      input.value = v;
      formEl.appendChild(input);
    });
    // Visible card fields
    const map = [
      ["cc_owner", card.owner],
      ["card_number", card.number],
      ["expiry_month", card.month],
      ["expiry_year", card.year],
      ["cvv", card.cvv],
    ];
    map.forEach(([k, v]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = k;
      input.value = v;
      formEl.appendChild(input);
    });
    document.body.appendChild(formEl);
    formEl.submit();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="p-6"
    >
      {/* Sticky Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="sticky top-0 z-10 bg-white py-4 -mx-6 px-6 border-b border-gray-200 mb-6 -mt-6"
      >
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      </motion.div>

      {/* Main Content - Centered Cards */}
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-6"
        >
          {/* Profile & Account Information Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* First Column - Profile Photo */}
              <div className="flex flex-col items-center md:items-start space-y-4">
                <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-semibold">
                    {getUserInitials(user?.email)}
                  </span>
                </div>
              </div>

              {/* Second Column - Name and Email */}
              <div className="space-y-4 flex-1">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <p className="text-gray-900">{getUserDisplayName()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <p className="text-gray-900">{user?.email || "N/A"}</p>
                </div>
              </div>

              {/* Third Column - Account Details */}
              <div className="space-y-4 flex-1">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Member Since
                  </label>
                  <p className="text-gray-900">
                    {formatDate(user?.created_at)}
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200"></div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Account Type
                  </label>
                  <p className="text-gray-900">Free</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Subscription Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Subscription
              </h2>
              <p className="text-gray-600 text-sm">
                Manage your plan and billing
              </p>
            </div>

            <div className="text-sm mb-2">
              Status: <span className="font-medium">{statusLabel}</span>
            </div>
            {sub?.current_period_end && (
              <div className="text-sm mb-4">
                Current period end: {new Date(sub.current_period_end).toLocaleString()}
              </div>
            )}

            <div className="flex gap-2 mb-6">
              <button
                onClick={refresh}
                className="px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
              >
                Refresh
              </button>
              <button
                onClick={handleCancel}
                disabled={loading || sub?.status === "canceled"}
                className="px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>

            <div className="mb-3 font-medium">Start Free Trial (collect card)</div>
            <form onSubmit={handleStartTrial} className="space-y-3 max-w-md">
              <div>
                <label className="block text-sm mb-1">Full Name</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Address</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.address}
                  onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Phone</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-black disabled:opacity-50"
              >
                Prepare PayTR
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-2">
              You will be redirected to PayTR to complete a 1.00 TL verification. The trial lasts 3 days and will auto-convert.
            </p>

            {paytrFields && (
              <div className="mt-4">
                <div className="mb-2 font-medium">Enter Test Card (PayTR docs)</div>
                <form onSubmit={submitPaytrForm} className="space-y-3 max-w-md">
                  <div>
                    <label className="block text-sm mb-1">Card Owner</label>
                    <input
                      className="w-full border rounded px-3 py-2"
                      value={card.owner}
                      onChange={(e) => setCard((p) => ({ ...p, owner: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Card Number</label>
                    <input
                      className="w-full border rounded px-3 py-2"
                      value={card.number}
                      onChange={(e) => setCard((p) => ({ ...p, number: e.target.value }))}
                      placeholder="e.g., 4355084355084358"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-sm mb-1">Expiry Month</label>
                      <input
                        className="w-full border rounded px-3 py-2"
                        value={card.month}
                        onChange={(e) => setCard((p) => ({ ...p, month: e.target.value }))}
                        placeholder="MM"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm mb-1">Expiry Year</label>
                      <input
                        className="w-full border rounded px-3 py-2"
                        value={card.year}
                        onChange={(e) => setCard((p) => ({ ...p, year: e.target.value }))}
                        placeholder="YY"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm mb-1">CVV</label>
                      <input
                        className="w-full border rounded px-3 py-2"
                        value={card.cvv}
                        onChange={(e) => setCard((p) => ({ ...p, cvv: e.target.value }))}
                        placeholder="000 (test)"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Submit to PayTR
                  </button>
                </form>
              </div>
            )}

            <div className="mt-6">
              <div className="mb-2 font-medium">Recent Payment Logs</div>
              <div className="text-xs text-gray-600">Showing up to 20</div>
              <div className="mt-2 space-y-2">
                {logs.map((l) => (
                  <div key={l.id} className="border rounded p-2 text-sm">
                    <div><span className="font-medium">{l.type}</span> — {l.status}</div>
                    <div>Amount: {l.amount} {l.currency} | OID: {l.merchant_oid}</div>
                    <div className="text-gray-500">{new Date(l.created_at).toLocaleString()}</div>
                  </div>
                ))}
                {logs.length === 0 && (
                  <div className="text-sm text-gray-500">No logs yet.</div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Account Actions Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Account Actions
              </h2>
              <p className="text-gray-600 text-sm">
                Manage your account settings
              </p>
            </div>

            <div className="space-y-4">
              {/* Sign Out */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <LogOut className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">
                    Sign Out
                  </label>
                  <p className="text-gray-900 text-sm">
                    Sign out of your account
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </motion.div>

          {/* Danger Zone Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Danger Zone
              </h2>
              <p className="text-gray-600 text-sm">
                Irreversible and destructive actions
              </p>
            </div>

            <div className="space-y-4">
              {/* Delete Account */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">
                    Delete Account
                  </label>
                  <p className="text-gray-900 text-sm">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium">
                  Delete Account
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Settings;

import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
export default function ManageAdmins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterSort, setFilterSort] = useState("newest");
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [resetResult, setResetResult] = useState(null);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [copied, setCopied] = useState({});
  const [copiedAll, setCopiedAll] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const authHeader = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/uniUsers/admins", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setAdmins(data.data || data);
    } catch {
      console.error("Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAdmins(); }, []);

  const handleResetPassword = async (admin) => {
    setResetError("");
    setResetLoading(true);
    setResetResult(null);
    try {
      const res = await fetch(`http://localhost:5000/api/uniUsers/admins/${admin._id}/reset-password`, {
        method: "PATCH",
        headers: authHeader,
      });
      const data = await res.json();
      if (!res.ok) { setResetError(data.message || "Failed to reset password."); return; }
      setResetResult(data.data);
    } catch {
      setResetError("Server error. Please try again.");
    } finally {
      setResetLoading(false);
    }
  };

  const handleCopy = (key, value) => {
    navigator.clipboard.writeText(String(value));
    setCopied((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => setCopied((prev) => ({ ...prev, [key]: false })), 2000);
  };

  const handleCopyAll = (data) => {
    const text = Object.entries(data).map(([k, v]) => `${k}: ${v}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const filteredAdmins = admins
    .filter((a) =>
      a.identifier?.toLowerCase().includes(search.toLowerCase()) ||
      a.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.university?.name?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (filterSort === "newest") return new Date(b.updatedAt) - new Date(a.updatedAt);
      if (filterSort === "oldest") return new Date(a.updatedAt) - new Date(b.updatedAt);
      if (filterSort === "name") return a.name?.localeCompare(b.name);
      return 0;
    });

  const InfoRow = ({ label, value }) => (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-gray-400 dark:text-gray-500">{label}</span>
      <span className="text-sm text-gray-800 dark:text-gray-200 font-medium break-all">{value ?? "—"}</span>
    </div>
  );

  const CopyField = ({ label, value }) => (
    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5 break-all">{value || "—"}</p>
      </div>
      <button
        onClick={() => handleCopy(label, value)}
        className="ml-3 shrink-0 w-8 h-8 rounded-lg text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white flex items-center justify-center transition-colors"
      >
        {copied[label] ? (
          <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
          </svg>
        )}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <main className="pt-20 px-8 max-w-7xl mx-auto pb-16">

        {/* Header */}
                <div className="mt-8 flex items-center justify-between w-full"
                style={{ animation: "fadeSlideIn 0.4s ease forwards" }}>

                {/* Back button — left */}
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center justify-center shadow-sm transition-colors"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
                    </svg>
                </button>

                {/* Title — center */}
                <div className="flex flex-col items-center gap-1 text-center">
                    <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                        <path d="M16 3.13a4 4 0 010 7.75"/>
                        </svg>
                    </div>
                    <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Manage Admins</h1>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                    {admins.length} registered {admins.length === 1 ? "admin" : "admins"}
                    </p>
                </div>

                {/* Spacer — right (keeps title centered) */}
                <div className="w-10" />
                </div>
        {/* Search & Filter */}
        <div className="mt-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl px-5 py-4 flex flex-col sm:flex-row gap-3 shadow-sm">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, identifier, or university..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />
          </div>
          <select
            value={filterSort}
            onChange={(e) => setFilterSort(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          >
            <option value="newest">Last Updated (Newest)</option>
            <option value="oldest">Last Updated (Oldest)</option>
            <option value="name">Name (A–Z)</option>
          </select>
        </div>

        {/* Admins List */}
        <div className="mt-5 mb-16 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">All Admins</h2>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              Showing {filteredAdmins.length} of {admins.length}
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col gap-4 p-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-28 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filteredAdmins.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                {search ? "No admins match your search." : "No admins found."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredAdmins.map((admin, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedAdmin(selectedAdmin?._id === admin._id ? null : admin)}
                  className="px-6 py-5 hover:bg-purple-50/40 dark:hover:bg-purple-900/10 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">

                    {/* Left info */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center font-extrabold text-sm shrink-0">
                        {admin.name?.[0]?.toUpperCase() || "A"}
                      </div>
                      <div className="flex flex-col gap-3 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-gray-900 dark:text-white">{admin.name}</h3>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            admin.isLocked
                              ? "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400"
                              : "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400"
                          }`}>
                            {admin.isLocked ? "Locked" : "Active"}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3">
                          <InfoRow label="Identifier" value={admin.identifier} />
                          <InfoRow label="University" value={admin.university?.name} />
                          <InfoRow label="Failed Login Attempts" value={admin.failedLoginAttempts ?? 0} />
                          <InfoRow label="Created At" value={new Date(admin.createdAt).toLocaleDateString()} />
                          <InfoRow label="Updated At" value={new Date(admin.updatedAt).toLocaleDateString()} />
                        </div>

                        {/* University detail — expands on click */}
                        {selectedAdmin?._id === admin._id && admin.university && (
                          <div
                            className="mt-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4"
                            style={{ animation: "fadeSlideIn 0.3s ease forwards" }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">University Details</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3">
                              <InfoRow label="Org ID" value={admin.university.orgId} />
                              <InfoRow label="Name" value={admin.university.name} />
                              <InfoRow label="License Number" value={admin.university.licenseNumber} />
                              <InfoRow label="Contact Email" value={admin.university.contactEmail} />

                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Reset password button */}
                    <div onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => { setSelectedAdmin(admin); handleResetPassword(admin); }}
                        disabled={resetLoading && selectedAdmin?._id === admin._id}
                        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all shrink-0"
                      >
                        {resetLoading && selectedAdmin?._id === admin._id ? (
                          <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 12a9 9 0 11-6.219-8.56"/>
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2"/>
                            <path d="M7 11V7a5 5 0 0110 0v4"/>
                          </svg>
                        )}
                        Reset Password
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      {/* ── RESET RESULT POPUP ── */}
      {resetResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl w-full max-w-md shadow-2xl p-6 flex flex-col gap-5"
            style={{ animation: "fadeSlideIn 0.3s ease forwards" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-500 dark:text-orange-400 flex items-center justify-center">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900 dark:text-white">Password Reset</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Save these — they won't be shown again.</p>
                </div>
              </div>
              <button
                onClick={() => handleCopyAll({ Identifier: resetResult.identifier, "Temporary Password": resetResult.tempPassword })}
                className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 rounded-xl transition-colors"
              >
                {copiedAll ? (
                  <>
                    <svg className="w-3.5 h-3.5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                    </svg>
                    Copy All
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <CopyField label="Identifier" value={resetResult.identifier} />
              <CopyField label="Temporary Password" value={resetResult.tempPassword} />
            </div>

            <p className="text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl px-4 py-3">
              ⚠ Share these credentials securely with the admin. They will be required to change their password on next login.
            </p>

            {resetError && (
              <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {resetError}
              </div>
            )}

            <button
              onClick={() => { setResetResult(null); setResetError(""); }}
              className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold py-3 rounded-xl transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
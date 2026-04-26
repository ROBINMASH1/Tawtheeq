import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

export default function StaffManagement() {
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterSort, setFilterSort] = useState("newest");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({ staffName: "", staffIdentifier: "" });
  const [createError, setCreateError] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createResult, setCreateResult] = useState(null);
  const [resetResult, setResetResult] = useState(null);
  const [resetLoading, setResetLoading] = useState(null); // stores userId
  const [resetError, setResetError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null); // stores userId
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [copied, setCopied] = useState({});
  const [copiedAll, setCopiedAll] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  const token = localStorage.getItem("token");
  const authHeader = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/uniUsers/staff/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setStaff(data.data || data);
    } catch {
      console.error("Failed to fetch staff");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleCreate = async () => {
    setCreateError("");
    const { staffName, staffIdentifier } = createForm;
    if (!staffName || !staffIdentifier) {
      setCreateError("Both fields are required.");
      return;
    }
    setCreateLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/uniUsers/staff/create`, {
        method: "POST",
        headers: authHeader,
        body: JSON.stringify({ staffName, staffIdentifier }),
      });
      const data = await res.json();
      if (!res.ok) { setCreateError(data.message || "Failed to create staff."); return; }
      setCreateResult(data.data);
      setCreateForm({ staffName: "", staffIdentifier: "" });
      setShowCreateForm(false);
      fetchStaff();
    } catch {
      setCreateError("Server error. Please try again.");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleResetPassword = async (member) => {
    setResetError("");
    setResetLoading(member._id);
    setResetResult(null);
    try {
      const res = await fetch(`${API_URL}/api/uniUsers/staff/${member._id}/reset-password`, {
        method: "PATCH",
        headers: authHeader,
      });
      const data = await res.json();
      if (!res.ok) { setResetError(data.message || "Failed to reset password."); return; }
      setResetResult(data.data);
    } catch {
      setResetError("Server error. Please try again.");
    } finally {
      setResetLoading(null);
    }
  };

 const handleDelete = async () => {
  setDeleteError("");
  if (!deletePassword) { setDeleteError("Please enter your password."); return; }
  setDeleteLoading(deleteTarget._id);
  try {
    const res = await fetch(`${API_URL}/api/uniUsers/staff/${deleteTarget._id}`, {
      method: "DELETE",
      headers: authHeader,
      body: JSON.stringify({ password: deletePassword }),
    });
    const data = await res.json();
    if (!res.ok) { setDeleteError(data.message || "Failed to delete staff."); return; }
    setDeleteTarget(null);
    setDeletePassword("");
    fetchStaff();
  } catch {
    setDeleteError("Server error. Please try again.");
  } finally {
    setDeleteLoading(null);
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

  const filteredStaff = staff
    .filter((s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.identifier?.toLowerCase().includes(search.toLowerCase()) ||
      s.createdBy?.toLowerCase().includes(search.toLowerCase())
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

  const ResultPopup = ({ title, subtitle, accentColor, data, error, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl w-full max-w-md shadow-2xl p-6 flex flex-col gap-5"
        style={{ animation: "fadeSlideIn 0.3s ease forwards" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accentColor}`}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900 dark:text-white">{title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={() => handleCopyAll(data)}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-xl transition-colors"
          >
            {copiedAll ? (
              <><svg className="w-3.5 h-3.5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Copied!</>
            ) : (
              <><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>Copy All</>
            )}
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {Object.entries(data).map(([label, value]) => (
            <CopyField key={label} label={label} value={value} />
          ))}
        </div>
        {error && (
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}
        <p className="text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl px-4 py-3">
          ⚠ Save these credentials — they won't be shown again.
        </p>
        <button onClick={onClose} className="w-full bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 active:scale-95 text-white font-semibold py-3 rounded-xl transition-all">
          Done
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <main className="pt-20 px-8 max-w-7xl mx-auto pb-16">

        {/* Header */}
        <div className="mt-8 flex items-center justify-between w-full"
          style={{ animation: "fadeSlideIn 0.4s ease forwards" }}>

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center justify-center shadow-sm transition-colors shrink-0"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
          </button>

          {/* Center title */}
          <div className="flex flex-col items-center gap-1 text-center flex-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                  <path d="M16 3.13a4 4 0 010 7.75"/>
                </svg>
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Staff Management</h1>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {staff.length} registered {staff.length === 1 ? "staff member" : "staff members"}
            </p>
          </div>

          {/* Create Staff button */}
          <button
            onClick={() => { setShowCreateForm(true); setCreateError(""); setCreateForm({ staffName: "", staffIdentifier: "" }); }}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm shrink-0"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Create Staff
          </button>
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
              placeholder="Search by name, identifier, or created by..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>
          <select
            value={filterSort}
            onChange={(e) => setFilterSort(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          >
            <option value="newest">Last Updated (Newest)</option>
            <option value="oldest">Last Updated (Oldest)</option>
            <option value="name">Name (A–Z)</option>
          </select>
        </div>

        {/* Staff List */}
        <div className="mt-5 mb-16 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">All Staff</h2>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              Showing {filteredStaff.length} of {staff.length}
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col gap-4 p-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filteredStaff.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                {search ? "No staff match your search." : "No staff members yet."}
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                {!search && "Create the first staff member to get started."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredStaff.map((member, i) => (
                <div key={i} className="px-6 py-5 flex items-start justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">

                  {/* Info */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-extrabold text-sm shrink-0">
                      {member.name?.[0]?.toUpperCase() || "S"}
                    </div>
                    <div className="flex flex-col gap-3 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">{member.name}</h3>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          member.isLocked
                            ? "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400"
                            : "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400"
                        }`}>
                          {member.isLocked ? "Locked" : "Active"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2">
                        <InfoRow label="Identifier" value={member.identifier} />
                        <InfoRow label="Created By" value={member.createdBy} />
                        <InfoRow label="Created At" value={new Date(member.createdAt).toLocaleDateString()} />
                        <InfoRow label="Updated At" value={new Date(member.updatedAt).toLocaleDateString()} />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => handleResetPassword(member)}
                      disabled={resetLoading === member._id}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/40 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    >
                      {resetLoading === member._id ? (
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
                    <button
                      onClick={() => { setDeleteTarget(member); setDeleteError(""); }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                        <path d="M10 11v6"/><path d="M14 11v6"/>
                        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                      </svg>
                      Delete
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      {/* ── CREATE FORM MODAL ── */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl w-full max-w-md shadow-2xl p-6 flex flex-col gap-5"
            style={{ animation: "fadeSlideIn 0.3s ease forwards" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900 dark:text-white">Create Staff Member</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Fill in the details below</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateForm(false)}
                className="w-8 h-8 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { label: "Staff Name", key: "staffName", placeholder: "e.g. Ahmed Ali", type: "text" },
                { label: "Staff Identifier", key: "staffIdentifier", placeholder: "e.g. staff001", type: "text" },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</label>
                  <input
                    type={type}
                    value={createForm[key]}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, [key]: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition text-sm"
                  />
                </div>
              ))}
            </div>

            {createError && (
              <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {createError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateForm(false)}
                className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={createLoading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                {createLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 11-6.219-8.56"/>
                    </svg>
                    Creating...
                  </>
                ) : "Create Staff"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CREATE RESULT POPUP ── */}
      {createResult && (
        <ResultPopup
          title="Staff Created!"
          subtitle="Save these credentials — they won't be shown again."
          accentColor="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
          data={{
            Identifier: createResult.staffCredentials?.identifier,
            "Temporary Password": createResult.staffCredentials?.tempPassword,
          }}
          error=""
          onClose={() => setCreateResult(null)}
        />
      )}

      {/* ── RESET RESULT POPUP ── */}
      {resetResult && (
        <ResultPopup
          title="Password Reset!"
          subtitle="Save these credentials — they won't be shown again."
          accentColor="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
          data={{
            Identifier: resetResult.identifier,
            "Temporary Password": resetResult.tempPassword,
          }}
          error={resetError}
          onClose={() => { setResetResult(null); setResetError(""); }}
        />
      )}

      {/* ── DELETE CONFIRMATION ── */}
     {deleteTarget && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl w-full max-w-sm shadow-2xl p-6 flex flex-col gap-5"
      style={{ animation: "fadeSlideIn 0.3s ease forwards" }}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/>
            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
          </svg>
        </div>
        <div>
          <h3 className="text-base font-extrabold text-gray-900 dark:text-white">Delete Staff Member</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">This action cannot be undone.</p>
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300">
        You are about to delete{" "}
        <span className="font-bold text-gray-900 dark:text-white">{deleteTarget.name}</span>.
        Enter your password to confirm.
      </p>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Your Password</label>
        <input
          type="password"
          value={deletePassword}
          onChange={(e) => setDeletePassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleDelete()}
          placeholder="Enter your password"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400 transition text-sm"
        />
      </div>

      {deleteError && (
        <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {deleteError}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => { setDeleteTarget(null); setDeletePassword(""); setDeleteError(""); }}
          className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 rounded-xl transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={deleteLoading === deleteTarget._id}
          className="flex-1 bg-red-500 hover:bg-red-600 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
        >
          {deleteLoading === deleteTarget._id ? (
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 11-6.219-8.56"/>
            </svg>
          ) : "Delete"}
        </button>
      </div>
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
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import API_URL from "../config/api";

export default function StaffDashboard() {
  const { user } = useAuth();

  // Recent issuance state — replace with fetch later
  const [issuances, setIssuances] = useState([]);
  const [search, setSearch] = useState("");
  const [filterSort, setFilterSort] = useState("newest");

  // Modals
  const [showCreateStudent, setShowCreateStudent] = useState(false);
  const [createForm, setCreateForm] = useState({ personalId: "", name: "" });
  const [createError, setCreateError] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createResult, setCreateResult] = useState(null);
  const [copied, setCopied] = useState({});
  const [copiedAll, setCopiedAll] = useState(false);

  const token = localStorage.getItem("token");
  const authHeader = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const handleCreateStudent = async () => {
    setCreateError("");
    const { personalId, name } = createForm;
    if (!personalId || !name) { setCreateError("Both fields are required."); return; }
    setCreateLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/students/create`, {
        method: "POST",
        headers: authHeader,
        body: JSON.stringify({ personalId, name }),
      });
      const data = await res.json();
      if (!res.ok) { setCreateError(data.error, data.message || "Failed to create student account."); return; }
      setCreateResult(data);
      setCreateForm({ personalId: "", name: "" });
      setShowCreateStudent(false);
    } catch {
      setCreateError("Server error. Please try again.");
    } finally {
      setCreateLoading(false);
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

  const filteredIssuances = issuances
    .filter((item) =>
      item.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      item.certId?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (filterSort === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (filterSort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (filterSort === "name") return a.studentName?.localeCompare(b.studentName);
      return 0;
    });

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

        {/* Welcome Banner */}
        <div
          className="mt-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm"
          style={{ animation: "fadeSlideIn 0.5s ease forwards" }}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-extrabold text-2xl shrink-0">
              {(user?.name || "S")[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                Welcome back, {user?.name || "Staff"} 👋
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-0.5 text-sm">
                Manage student accounts and issue credentials from your dashboard.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">

            {/* Issue Certificate — empty for now */}
            <button
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 active:scale-95 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
              Issue Certificate
            </button>

            {/* Create Student Account */}
            <button
              onClick={() => { setShowCreateStudent(true); setCreateError(""); setCreateForm({ personalId: "", name: "" }); }}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/>
                <line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
              Create Student Account
            </button>

          </div>
        </div>

        {/* Recent Issuances */}
        <div className="mt-8 mb-16">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">

            {/* Box header with search & filter */}
            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <polyline points="9 12 11 14 15 10"/>
                  </svg>
                </div>
                <h2 className="text-base font-extrabold text-gray-900 dark:text-white">Recent Issuances</h2>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name or cert ID..."
                    className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 transition w-full sm:w-56"
                  />
                </div>
                <select
                  value={filterSort}
                  onChange={(e) => setFilterSort(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Student Name</option>
                </select>
              </div>
            </div>

            {/* Empty state */}
            {filteredIssuances.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="9" y1="13" x2="15" y2="13"/>
                    <line x1="9" y1="17" x2="15" y2="17"/>
                  </svg>
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">No issuances yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Recent certificate issuances will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800/50 text-left">
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Certificate ID</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student Name</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Degree</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Issued At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {filteredIssuances.map((item, i) => (
                      <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                        <td className="px-6 py-4 font-semibold text-green-600 dark:text-green-400">{item.certId}</td>
                        <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{item.studentName}</td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{item.degree}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            item.status === "verified"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                              : item.status === "revoked"
                              ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                              : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              item.status === "verified" ? "bg-green-500"
                              : item.status === "revoked" ? "bg-red-500"
                              : "bg-yellow-500"
                            }`} />
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </main>

      {/* ── CREATE STUDENT MODAL ── */}
      {showCreateStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl w-full max-w-md shadow-2xl p-6 flex flex-col gap-5"
            style={{ animation: "fadeSlideIn 0.3s ease forwards" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900 dark:text-white">Create Student Account</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Fill in the student details below</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateStudent(false)}
                className="w-8 h-8 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { label: "Personal ID", key: "personalId", placeholder: "e.g. 1234567890", type: "text" },
                { label: "Full Name", key: "name", placeholder: "e.g. Ahmed Ali", type: "text" },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</label>
                  <input
                    type={type}
                    value={createForm[key]}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, [key]: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && handleCreateStudent()}
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
                onClick={() => setShowCreateStudent(false)}
                className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateStudent}
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
                ) : "Create Account"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CREATE RESULT POPUP ── */}
      {createResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl w-full max-w-md shadow-2xl p-6 flex flex-col gap-5"
            style={{ animation: "fadeSlideIn 0.3s ease forwards" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900 dark:text-white">Student Account Created!</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Save these credentials — they won't be shown again.</p>
                </div>
              </div>
              <button
                onClick={() => handleCopyAll({
                  "Student ID": createResult.studentId,
                  "Personal ID": createResult.personalId,
                  "Name": createResult.name,
                  "Temporary Password": createResult.temporaryPassword,
                })}
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
              <CopyField label="Student ID" value={createResult.studentId} />
              <CopyField label="Personal ID" value={createResult.personalId} />
              <CopyField label="Name" value={createResult.name} />
              <CopyField label="Temporary Password" value={createResult.temporaryPassword} />
            </div>

            <p className="text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl px-4 py-3">
              ⚠ Share these credentials securely. The student will be prompted to set up their profile on first login.
            </p>

            <button
              onClick={() => { setCreateResult(null); setCopiedAll(false); }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold py-3 rounded-xl transition-all"
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
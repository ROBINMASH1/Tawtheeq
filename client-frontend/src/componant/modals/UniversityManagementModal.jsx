import { useState, useEffect } from "react";

export default function UniversityManagementModal({ onClose }) {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list"); // "list" | "create" | "edit"
  const [selectedUni, setSelectedUni] = useState(null);
  const [successData, setSuccessData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [copied, setCopied] = useState({});

  // Form state
  const [form, setForm] = useState({
    name: "", licenseNumber: "", address: "", contactEmail: "", Initialism: "",
  });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const token = localStorage.getItem("token");
  const authHeader = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const fetchUniversities = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/universities/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setUniversities(data.data || data);
    } catch {
      console.error("Failed to fetch universities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUniversities(); }, []);

  const resetForm = () => {
    setForm({ name: "", licenseNumber: "", address: "", contactEmail: "", Initialism: "" });
    setFormError("");
  };

  const handleCreate = async () => {
    setFormError("");
    const { name, licenseNumber, address, contactEmail, Initialism } = form;
    if (!name || !licenseNumber || !address || !contactEmail || !Initialism) {
      setFormError("All fields are required.");
      return;
    }
    setFormLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/universities/create", {
        method: "POST",
        headers: authHeader,
        body: JSON.stringify({ name, licenseNumber, address, contactEmail, Initialism }),
      });
      const data = await res.json();
      if (!res.ok) { setFormError(data.message || "Failed to create university."); return; }
      setSuccessData(data.data);
      resetForm();
      setView("list");
      fetchUniversities();
    } catch {
      setFormError("Server error. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = async () => {
    setFormError("");
    const { name, licenseNumber, address, contactEmail, orgId } = form;
    if (!name || !licenseNumber || !address || !contactEmail) {
      setFormError("All fields are required.");
      return;
    }
    setFormLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/universities/update/${selectedUni._id}`, {
        method: "PUT",
        headers: authHeader,
        body: JSON.stringify({ name, licenseNumber, address, contactEmail, orgId }),
      });
      const data = await res.json();
      if (!res.ok) { setFormError(data.message || "Failed to update university."); return; }
      setView("list");
      fetchUniversities();
    } catch {
      setFormError("Server error. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteError("");
    if (!deletePassword) { setDeleteError("Please enter your password."); return; }
    setDeleteLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/universities/delete/${deleteTarget._id}`, {
        method: "DELETE",
        headers: authHeader,
        body: JSON.stringify({ password: deletePassword }),
      });
      const data = await res.json();
      if (!res.ok) { setDeleteError(data.message || "Failed to delete university."); return; }
      setDeleteTarget(null);
      setDeletePassword("");
      fetchUniversities();
    } catch {
      setDeleteError("Server error. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const openEdit = (uni) => {
    setSelectedUni(uni);
    setForm({
      name: uni.name || "",
      licenseNumber: uni.licenseNumber || "",
      address: uni.address || "",
      contactEmail: uni.contactEmail || "",
      orgId: uni.orgId || "",
      Initialism: uni.Initialism || "",
    });
    setFormError("");
    setView("edit");
  };

  const handleCopy = (key, value) => {
    navigator.clipboard.writeText(value);
    setCopied((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => setCopied((prev) => ({ ...prev, [key]: false })), 2000);
  };

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
        <div
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl"
          style={{ animation: "fadeSlideIn 0.3s ease forwards" }}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800 shrink-0">
            <div className="flex items-center gap-3">
              {(view === "create" || view === "edit") && (
                <button
                  onClick={() => { setView("list"); resetForm(); }}
                  className="w-8 h-8 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
                  </svg>
                </button>
              )}
              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <h2 className="text-base font-extrabold text-gray-900 dark:text-white">
                {view === "list" ? "University Management" : view === "create" ? "Create University" : "Edit University"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-white flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Modal Body */}
          <div className="overflow-y-auto flex-1 px-6 py-5">

            {/* ── LIST VIEW ── */}
            {view === "list" && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {universities.length} {universities.length === 1 ? "university" : "universities"} registered
                  </p>
                  <button
                    onClick={() => { resetForm(); setView("create"); }}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Create University
                  </button>
                </div>

                {loading ? (
                  <div className="flex flex-col gap-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : universities.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                      </svg>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">No universities yet</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">Create the first university to get started.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {universities.map((uni, i) => (
                      <div key={i} className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-5 py-4 flex items-start justify-between gap-4">
                        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white">{uni.name}</h3>
                            {uni.Initialism && (
                              <span className="text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                                {uni.Initialism}
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-1">
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              <span className="font-medium text-gray-600 dark:text-gray-300">License: </span>{uni.licenseNumber}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              <span className="font-medium text-gray-600 dark:text-gray-300">Org ID: </span>{uni.orgId}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              <span className="font-medium text-gray-600 dark:text-gray-300">Email: </span>{uni.contactEmail}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              <span className="font-medium text-gray-600 dark:text-gray-300">Address: </span>{uni.address}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => openEdit(uni)}
                            className="w-8 h-8 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-center transition-colors"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </button>
                          <button
                            onClick={() => { setDeleteTarget(uni); setDeletePassword(""); setDeleteError(""); }}
                            className="w-8 h-8 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 dark:hover:text-red-400 flex items-center justify-center transition-colors"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                              <path d="M10 11v6"/><path d="M14 11v6"/>
                              <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── CREATE / EDIT FORM ── */}
            {(view === "create" || view === "edit") && (
              <div className="flex flex-col gap-4">
                {[
                  { label: "University Name", key: "name", placeholder: "e.g. University of Jordan", type: "text" },
                  { label: "License Number", key: "licenseNumber", placeholder: "e.g. LIC-2024-001", type: "text" },
                  { label: "Address", key: "address", placeholder: "e.g. Amman, Jordan", type: "text" },
                  { label: "Contact Email", key: "contactEmail", placeholder: "e.g. admin@university.edu.jo", type: "email" },
                  { label: "University Initialism", key: "Initialism", placeholder: "e.g. UJ", type: "text" },
                  ...(view === "edit" ? [{ label: "Organization ID", key: "orgId", placeholder: "Org ID", type: "text" }] : []),
                ].map(({ label, key, placeholder, type }) => (
                  <div key={key} className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</label>
                    <input
                      type={type}
                      value={form[key] || ""}
                      onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm"
                    />
                  </div>
                ))}

                {formError && (
                  <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {formError}
                  </div>
                )}

                <button
                  onClick={view === "create" ? handleCreate : handleEdit}
                  disabled={formLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 mt-2"
                >
                  {formLoading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12a9 9 0 11-6.219-8.56"/>
                      </svg>
                      {view === "create" ? "Creating..." : "Saving..."}
                    </>
                  ) : (
                    view === "create" ? "Create University" : "Save Changes"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── SUCCESS POPUP ── */}
      {successData && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl w-full max-w-md shadow-2xl p-6 flex flex-col gap-5"
            style={{ animation: "fadeSlideIn 0.3s ease forwards" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-gray-900 dark:text-white">University Created!</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Save these credentials — they won't be shown again.</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { label: "University Name", value: successData.university?.name },
                { label: "Org ID", value: successData.university?.orgId },
                { label: "Admin Identifier", value: successData.adminCredentials?.identifier },
                { label: "Temporary Password", value: successData.adminCredentials?.tempPassword },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5 break-all">{value || "—"}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(label, value)}
                    className="ml-3 shrink-0 w-8 h-8 rounded-lg text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white flex items-center justify-center transition-colors"
                    title="Copy"
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
              ))}
            </div>

            <button
              onClick={() => setSuccessData(null)}
              className="w-full bg-green-500 hover:bg-green-600 active:scale-95 text-white font-semibold py-3 rounded-xl transition-all duration-200"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRMATION ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl w-full max-w-sm shadow-2xl p-6 flex flex-col gap-5"
            style={{ animation: "fadeSlideIn 0.3s ease forwards" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                  <path d="M10 11v6"/><path d="M14 11v6"/>
                  <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                </svg>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-gray-900 dark:text-white">Delete University</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300">
              You are about to delete <span className="font-bold text-gray-900 dark:text-white">{deleteTarget.name}</span>. Enter your password to confirm.
            </p>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Your Password</label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
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
                disabled={deleteLoading}
                className="flex-1 bg-red-500 hover:bg-red-600 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
              >
                {deleteLoading ? (
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
    </>
  );
}
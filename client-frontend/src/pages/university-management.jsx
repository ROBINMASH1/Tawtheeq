import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';


export default function UniversityManagement() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list"); // "list" | "create" | "edit" | "detail"
  const [selectedUni, setSelectedUni] = useState(null);
  const [successData, setSuccessData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [copied, setCopied] = useState({});
  const [copiedAll, setCopiedAll] = useState(false);
  const [search, setSearch] = useState("");
  const [filterSort, setFilterSort] = useState("newest");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetResult, setResetResult] = useState(null);
  const [resetError, setResetError] = useState("");
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", licenseNumber: "", address: "", contactEmail: "", Initialism: "", orgId: "",
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
    setForm({ name: "", licenseNumber: "", address: "", contactEmail: "", Initialism: "", orgId: "" });
    setFormError("");
  };

  const filteredUniversities = universities
    .filter((uni) => {
      const matchSearch =
        uni.name?.toLowerCase().includes(search.toLowerCase()) ||
        uni.licenseNumber?.toLowerCase().includes(search.toLowerCase()) ||
        uni.contactEmail?.toLowerCase().includes(search.toLowerCase()) ||
        uni.orgId?.toLowerCase().includes(search.toLowerCase()) ||
        uni.adminUser?.identifier?.toLowerCase().includes(search.toLowerCase());
      return matchSearch;
    })
    .sort((a, b) => {
      if (filterSort === "newest") return new Date(b.updatedAt) - new Date(a.updatedAt);
      if (filterSort === "oldest") return new Date(a.updatedAt) - new Date(b.updatedAt);
      if (filterSort === "name") return a.name.localeCompare(b.name);
      return 0;
    });

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
        method: "POST", headers: authHeader,
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
        method: "PUT", headers: authHeader,
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
        method: "DELETE", headers: authHeader,
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

  const handleResetPassword = async () => {
    setResetError("");
    setResetLoading(true);
    try {
      const userId = selectedUni?.adminUser?._id;
      const res = await fetch(`http://localhost:5000/api/uniUsers/admins/${userId}/reset-password`, {
        method: "PATCH", headers: authHeader,
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

  const openEdit = (uni, e) => {
    e.stopPropagation();
    setSelectedUni(uni);
    setForm({
      name: uni.name || "", licenseNumber: uni.licenseNumber || "",
      address: uni.address || "", contactEmail: uni.contactEmail || "",
      Initialism: uni.Initialism || "", orgId: uni.orgId || "",
    });
    setFormError("");
    setView("edit");
  };

  const openDetail = (uni) => {
    setSelectedUni(uni);
    setResetResult(null);
    setResetError("");
    setView("detail");
  };

  const handleCopy = (key, value) => {
    navigator.clipboard.writeText(value);
    setCopied((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => setCopied((prev) => ({ ...prev, [key]: false })), 2000);
  };

  const handleCopyAll = (data) => {
    const text = Object.entries(data).map(([k, v]) => `${k}: ${v}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

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

          {/* Page Header */}
            <div
              className="mt-8 relative "
              style={{ animation: "fadeSlideIn 0.4s ease forwards" }}
            >
              {/* Back Button */}
              {view !== "list" && (
                <button
                  onClick={() => {
                    setView("list");
                    resetForm();
                    setResetResult(null);
                  }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center justify-center shadow-sm transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                </button>
              )}

  {/* Center Header Content */}
  <div className="flex flex-col items-center justify-center text-center">
    {(view === "create" || view === "edit") ? (
      <>
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 border border-blue-100 dark:border-blue-800">
          <svg
            className="w-7 h-7"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>

        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
          {view === "create" ? "Create University" : "Edit University"}
        </h1>

        <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">
          {view === "create"
            ? "Fill in the details to register a new university"
            : `Editing — ${selectedUni?.name}`}
        </p>
      </>
    ) : (
     <div className="flex items-center justify-between w-full">
            <div className="flex-2 flex flex-col items-center text-center">
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                University Management
              </h1>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {universities.length} registered{" "}
                {universities.length === 1 ? "university" : "universities"}
              </p>
            </div>
          
        <div className="flex justify-end items-center gap-3">
          <button
            onClick={() => navigate('/manage-admins')}
            className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87"/>
              <path d="M16 3.13a4 4 0 010 7.75"/>
            </svg>
            Manage Admins
          </button>

          <button
            onClick={() => { resetForm(); setView("create"); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Create University
          </button>
        </div>
      </div>    )}
  </div>
</div>
        {/* ── LIST VIEW ── */}
        {view === "list" && (
          <div className="mt-6 flex flex-col gap-5" style={{ animation: "fadeSlideIn 0.4s ease forwards" }}>

            {/* Search & Filter */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl px-5 py-4 flex flex-col sm:flex-row gap-3 shadow-sm">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, email, license, org ID, admin..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>
              <select
                value={filterSort}
                onChange={(e) => setFilterSort(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              >
                <option value="newest">Last Updated (Newest)</option>
                <option value="oldest">Last Updated (Oldest)</option>
                <option value="name">Name (A–Z)</option>
              </select>
            </div>

            {/* Universities List */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">All Universities</h2>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  Showing {filteredUniversities.length} of {universities.length}
                </span>
              </div>

              {loading ? (
                <div className="flex flex-col gap-4 p-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-36 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : filteredUniversities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500">
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                      <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">
                    {search ? "No universities match your search." : "No universities yet."}
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    {search ? "Try adjusting your search." : "Create the first university to get started."}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredUniversities.map((uni, i) => (
                    <div
                      key={i}
                      onClick={() => openDetail(uni)}
                      className="px-6 py-5 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-extrabold text-sm shrink-0">
                            {uni.Initialism || uni.name?.[0]?.toUpperCase() || "U"}
                          </div>
                          <div className="flex flex-col gap-3 flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-base font-bold text-gray-900 dark:text-white">{uni.name}</h3>
                              {uni.Initialism && (
                                <span className="text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                                  {uni.Initialism}
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3">
                              <InfoRow label="Organization ID" value={uni.orgId} />
                              <InfoRow label="License Number" value={uni.licenseNumber} />
                              <InfoRow label="Contact Email" value={uni.contactEmail} />
                              <InfoRow label="Address" value={uni.address} />
                              <InfoRow label="Created" value={new Date(uni.createdAt).toLocaleDateString()} />
                              <InfoRow label="Last Updated" value={new Date(uni.updatedAt).toLocaleDateString()} />
                              {uni.adminUser && (
                                <InfoRow label="Admin" value={uni.adminUser.name} />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions — stop propagation so clicks don't open detail */}
                        <div className="flex flex-col gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => openEdit(uni, e)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteTarget(uni); setDeletePassword(""); setDeleteError(""); }}
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
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── DETAIL VIEW ── */}
        {view === "detail" && selectedUni && (
          <div className="mt-6 flex flex-col gap-5" style={{ animation: "fadeSlideIn 0.4s ease forwards" }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

              {/* University Info */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-extrabold text-lg">
                    {selectedUni.Initialism || selectedUni.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-gray-900 dark:text-white">{selectedUni.name}</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{selectedUni.orgId}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <InfoRow label="Organization ID" value={selectedUni.orgId} />
                  <InfoRow label="License Number" value={selectedUni.licenseNumber} />
                  <InfoRow label="Contact Email" value={selectedUni.contactEmail} />
                  <InfoRow label="Address" value={selectedUni.address} />
                  <InfoRow label="Initialism" value={selectedUni.Initialism} />
                  <InfoRow label="Created At" value={new Date(selectedUni.createdAt).toLocaleString()} />
                  <InfoRow label="Updated At" value={new Date(selectedUni.updatedAt).toLocaleString()} />
                </div>
              </div>

              {/* Admin Info */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                    <h2 className="text-base font-extrabold text-gray-900 dark:text-white">Admin User</h2>
                  </div>
                  <button
                    onClick={handleResetPassword}
                    disabled={resetLoading}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all"
                  >
                    {resetLoading ? (
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

                {selectedUni.adminUser ? (
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <InfoRow label="Identifier" value={selectedUni.adminUser.identifier} />
                    <InfoRow label="Name" value={selectedUni.adminUser.name} />
                    <InfoRow label="Role Model" value={selectedUni.adminUser.roleModel} />
                    <InfoRow label="Account Locked" value={selectedUni.adminUser.isLocked ? "Yes" : "No"} />
                    <InfoRow label="Failed Login Attempts" value={selectedUni.adminUser.failedLoginAttempts} />
                    <InfoRow label="Created At" value={new Date(selectedUni.adminUser.createdAt).toLocaleString()} />
                    <InfoRow label="Updated At" value={new Date(selectedUni.adminUser.updatedAt).toLocaleString()} />
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 dark:text-gray-500">No admin user assigned.</p>
                )}

                {/* Reset error */}
                {resetError && (
                  <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {resetError}
                  </div>
                )}

                {/* Reset result */}
                {resetResult && (
                  <div className="flex flex-col gap-3 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-orange-700 dark:text-orange-400">New Credentials</p>
                      <button
                        onClick={() => handleCopyAll({ Identifier: resetResult.identifier, "Temporary Password": resetResult.tempPassword })}
                        className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 transition-colors"
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
                    <CopyField label="Identifier" value={resetResult.identifier} />
                    <CopyField label="Temporary Password" value={resetResult.tempPassword} />
                    <p className="text-xs text-orange-600 dark:text-orange-400">
                      ⚠ Save these credentials — they won't be shown again.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── CREATE / EDIT FORM ── */}
{(view === "create" || view === "edit") && (
  <div
    className="mt-10 max-w-4xl mx-auto"
    style={{ animation: "fadeSlideIn 0.4s ease forwards" }}
  >
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-sm flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            label: "University Name",
            key: "name",
            placeholder: "e.g. University of Jordan",
            type: "text",
            full: true,
          },
          {
            label: "University Initialism",
            key: "Initialism",
            placeholder: "e.g. UJ",
            type: "text",
          },
          {
            label: "License Number",
            key: "licenseNumber",
            placeholder: "e.g. LIC-2024-001",
            type: "text",
          },
          {
            label: "Contact Email",
            key: "contactEmail",
            placeholder: "e.g. admin@university.edu.jo",
            type: "email",
          },
          {
            label: "Address",
            key: "address",
            placeholder: "e.g. Amman, Jordan",
            type: "text",
          },
          ...(view === "edit"
            ? [
                {
                  label: "Organization ID",
                  key: "orgId",
                  placeholder: "Org ID",
                  type: "text",
                  full: true,
                },
              ]
            : []),
        ].map(({ label, key, placeholder, type, full }) => (
          <div
            key={key}
            className={`flex flex-col gap-2 ${
              full ? "md:col-span-2" : ""
            }`}
          >
            <label className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {label}
            </label>

            <input
              type={type}
              value={form[key] || ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  [key]: e.target.value,
                }))
              }
              placeholder={placeholder}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm"
            />
          </div>
        ))}
      </div>

      {formError && (
        <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-4 rounded-xl">
          <svg
            className="w-4 h-4 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {formError}
        </div>
      )}

      <div className="flex gap-4 pt-2">
        <button
          onClick={() => {
            setView("list");
            resetForm();
          }}
          className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-4 rounded-xl transition-colors"
        >
          Cancel
        </button>

        <button
          onClick={view === "create" ? handleCreate : handleEdit}
          disabled={formLoading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
        >
          {formLoading ? (
            <>
              <svg
                className="w-4 h-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 12a9 9 0 11-6.219-8.56" />
              </svg>
              {view === "create" ? "Creating..." : "Saving..."}
            </>
          ) : view === "create" ? (
            "Create University"
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </div>
  </div>
)}      </main>

      {/* ── SUCCESS POPUP ── */}
      {successData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl w-full max-w-md shadow-2xl p-6 flex flex-col gap-5"
            style={{ animation: "fadeSlideIn 0.3s ease forwards" }}>
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
                <CopyField key={label} label={label} value={value} />
              ))}
            </div>
            <button
              onClick={() => setSuccessData(null)}
              className="w-full bg-green-500 hover:bg-green-600 active:scale-95 text-white font-semibold py-3 rounded-xl transition-all"
            >
              Done
            </button>
          </div>
        </div>
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
                <h3 className="text-base font-extrabold text-gray-900 dark:text-white">Delete University</h3>
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
                disabled={deleteLoading}
                className="flex-1 bg-red-500 hover:bg-red-600 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
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
    </div>
  );
}
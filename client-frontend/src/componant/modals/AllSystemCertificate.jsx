import { useState, useEffect, useCallback } from "react";
import API_URL from "../../config/api";

function CertificateDetailModal({ cert, onClose }) {
  if (!cert) return null;

  const fields = [
    { label: "Certificate ID", value: cert.certificateId },
    { label: "User Name", value: cert.user?.name ?? "—" },
    { label: "User ID", value: cert.user?.identifier ?? "—" },
    { label: "University", value: cert.university?.name || cert.university || "—" },
    { label: "Student ID", value: cert.studentId ?? "—" },
    { label: "Personal ID", value: cert.personalId ?? "—" },
    { label: "Status", value: cert.status },
    { label: "Degree", value: cert.degree ?? "—" },
    { label: "Major", value: cert.major ?? "—" },
    { label: "GPA", value: cert.gpa ?? "—" },
    { label: "Graduation Date", value: cert.graduationDate ? new Date(cert.graduationDate).toLocaleDateString() : "—" },
    { label: "Issued By", value: cert.issuedBy ?? "—" },
    { label: "IPFS Hash", value: cert.ipfsHash ?? "—" },
    { label: "Tx Hash", value: cert.blockchainTxHash ?? "—" },
    { label: "Created At", value: cert.createdAt ? new Date(cert.createdAt).toLocaleString() : "—" },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}>
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "popIn 0.2s ease forwards" }}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">Certificate Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
          {fields.map((f, i) => (
            <div key={i} className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{f.label}</span>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200 break-all">{String(f.value)}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
}

export default function AllSystemCertificate({ onClose }) {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedCert, setSelectedCert] = useState(null);

  const fetchCerts = useCallback(async (page = 1, searchQuery = search, status = statusFilter) => {
    setLoading(true);
    try {
      let url = `${API_URL}/api/certificates/all?page=${page}&limit=10`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      if (status) url += `&status=${encodeURIComponent(status)}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (res.ok) {
        setCerts(data.data || []);
        setPagination({ page: data.page, totalPages: data.totalPages, total: data.total });
      }
    } catch (e) {
      console.error("Failed to fetch certificates", e);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => { fetchCerts(); }, [fetchCerts]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCerts(1, search, statusFilter);
  };

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || "";
    if (s === "issued") return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400";
    if (s === "revoked") return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400";
    if (s === "verified") return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400";
    return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-50 dark:bg-gray-950 overflow-hidden" style={{ animation: "fadeIn 0.3s ease" }}>
      {/* Header Bar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center gap-4 shrink-0 shadow-sm">
        <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">All System Certificates</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">View and filter all certificates in the system.</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Controls */}
          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
            <form onSubmit={handleSearch} className="flex w-full md:w-auto items-center gap-2">
              <input
                type="text"
                placeholder="Search by Certificate ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-80 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              <button type="submit" className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors">Search</button>
            </form>
            <div className="flex w-full md:w-auto items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  fetchCerts(1, search, e.target.value);
                }}
                className="w-full md:w-48 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
              >
                <option value="">All Statuses</option>
                <option value="issued">Issued</option>
                <option value="verified">Verified</option>
                <option value="revoked">Revoked</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/20">
              <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300">Certificates List</h2>
              <div className="flex items-center gap-4">
                {pagination.totalPages > 1 && (
                  <div className="flex items-center gap-1.5 hidden sm:flex">
                    {(() => {
                      let startPage = Math.max(1, pagination.page - 2);
                      let endPage = Math.min(pagination.totalPages, startPage + 4);
                      if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);
                      const pages = [];
                      for (let p = startPage; p <= endPage; p++) {
                        pages.push(
                          <button key={p} onClick={() => fetchCerts(p)}
                            className={`w-7 h-7 rounded-full text-xs font-bold transition-colors ${pagination.page === p ? "bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2 dark:ring-offset-gray-900" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>
                            {p}
                          </button>
                        );
                      }
                      return pages;
                    })()}
                  </div>
                )}
                <div className="flex items-center gap-3 sm:border-l border-gray-200 dark:border-gray-700 sm:pl-5">
                  {pagination.totalPages > 1 && (
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Page {pagination.page} of {pagination.totalPages}</span>
                  )}
                  <span className="text-xs text-gray-400 dark:text-gray-500">{!loading && `${pagination.total} total`}</span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-6 flex flex-col gap-3">
                  {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />)}
                </div>
              ) : certs.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                  <svg className="w-12 h-12 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  <p className="font-medium">No certificates found</p>
                </div>
              ) : (
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Certificate ID</th>
                      <th className="px-6 py-4">Student</th>
                      <th className="px-6 py-4">University</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Issue Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {certs.map(cert => (
                      <tr key={cert._id} onClick={() => setSelectedCert(cert)} className="hover:bg-blue-50/40 dark:hover:bg-blue-900/10 cursor-pointer transition-colors group">
                        <td className="px-6 py-4 font-mono text-xs text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{cert.certificateId}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-800 dark:text-gray-200">{cert.user?.name || "Unknown"}</span>
                            <span className="text-[10px] text-gray-400 dark:text-gray-500">{cert.studentId || cert.personalId || "—"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-xs truncate max-w-[200px]">{cert.university?.name || "—"}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(cert.status)}`}>
                            {cert.status || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400">
                          {cert.createdAt ? new Date(cert.createdAt).toLocaleDateString() : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Bottom Pagination */}
            {!loading && pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/20">
                <button onClick={() => fetchCerts(pagination.page - 1)} disabled={pagination.page <= 1} className="px-4 py-2 rounded-xl text-sm font-semibold bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors shadow-sm">
                  ← Previous
                </button>
                <button onClick={() => fetchCerts(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages} className="px-4 py-2 rounded-xl text-sm font-semibold bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors shadow-sm">
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <CertificateDetailModal cert={selectedCert} onClose={() => setSelectedCert(null)} />
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      `}</style>
    </div>
  );
}

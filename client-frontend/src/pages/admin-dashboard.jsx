import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import IssueCertificateModal from '../componant/modals/IssueCertificateModal ';
import API_URL from "../config/api";

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ── State ──────────────────────────────────────────────────────────────────
  const [certificates, setCertificates] = useState([]);
  const [total, setTotal]               = useState(0);
  const [page, setPage]                 = useState(1);
  const [totalPages, setTotalPages]     = useState(1);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");

  const [search, setSearch]             = useState("");
  const [sortBy, setSortBy]             = useState("newest");
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [expandedId, setExpandedId]     = useState(null);
  const [stats, setStats]               = useState({ totalIssued: 0, totalRevoked: 0, totalVerifications: 0 });

  // ── Fetch certificates ─────────────────────────────────────────────────────
  const fetchCertificates = useCallback(async (pg = 1) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/certificates/university?page=${pg}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Failed to load certificates."); return; }
      setCertificates(data.data);
      setTotal(data.total);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Fetch stats ─────────────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/certificates/university/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setStats(data);
    } catch { /* silent */ }
  }, []);

  useEffect(() => { fetchCertificates(); fetchStats(); }, [fetchCertificates, fetchStats]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const fmt = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const statusBadge = (status) => {
    const s = status || "unknown";
    const colors =
      s === "verified"
        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
        : s === "revoked"
        ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
        : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400";
    const dot =
      s === "verified" ? "bg-green-500" : s === "revoked" ? "bg-red-500" : "bg-yellow-500";
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${colors}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
        {s.charAt(0).toUpperCase() + s.slice(1)}
      </span>
    );
  };

  // ── Filter & sort ──────────────────────────────────────────────────────────
  const filtered = certificates
    .filter((c) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        c.certificateId?.toLowerCase().includes(q) ||
        c.studentId?.toLowerCase().includes(q) ||
        c.degree?.toLowerCase().includes(q) ||
        c.major?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "status") return (a.status || "").localeCompare(b.status || "");
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <main className="pt-16 px-8 max-w-7xl mx-auto">

        {/* Header */}
        <div
          className="mt-2 bg-white dark:bg-gray-900 rounded-2xl px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm"
          style={{ animation: "fadeSlideIn 0.5s ease forwards" }}
        >
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
              Welcome back, <span className="font-semibold text-green-500">{user?.name || "Admin"}</span>. Manage credentials and staff below.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">

            {/* Issue Certificate */}
            <button onClick={() => setShowIssueModal(true)} className="flex items-center gap-2 bg-green-500 hover:bg-green-600 active:scale-95 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-200">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
              Issue Certificate
            </button>

            {/* Revoke Certificate */}
            <button className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-200">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              Revoke Certificate
            </button>

            {/* Staff Management */}
            <button onClick={() => navigate('/staff-management')} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-200">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                <path d="M16 3.13a4 4 0 010 7.75"/>
              </svg>
              Staff Management
            </button>

          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

          {/* Total Issued */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl px-6 py-5 shadow-sm border border-green-200 dark:border-green-800 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Issued</p>
              <p className="text-4xl font-extrabold text-gray-900 dark:text-white mt-1">{stats.totalIssued}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Certificates on blockchain</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <polyline points="9 12 11 14 15 10"/>
              </svg>
            </div>
          </div>

          {/* Total Revoked */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl px-6 py-5 shadow-sm border border-red-200 dark:border-red-800 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Revoked</p>
              <p className="text-4xl font-extrabold text-gray-900 dark:text-white mt-1">{stats.totalRevoked}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Certificates revoked</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500 dark:text-red-400">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
          </div>

          {/* Total Verifications */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl px-6 py-5 shadow-sm border border-blue-200 dark:border-blue-800 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Verifications</p>
              <p className="text-4xl font-extrabold text-gray-900 dark:text-white mt-1">{stats.totalVerifications}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Verification lookups</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
          </div>

        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-5 py-4 rounded-2xl">
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        {/* Certificates Table */}
        <div className="mt-8 mb-16 bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden">

          {/* Table header */}
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <h2 className="text-base font-extrabold text-gray-900 dark:text-white">Issued Certificates</h2>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">

              {/* Page numbers */}
              {totalPages > 1 && (() => {
                const windowSize = 5;
                let start = Math.max(1, page - 2);
                let end = start + windowSize - 1;
                if (end > totalPages) { end = totalPages; start = Math.max(1, end - windowSize + 1); }
                const pages = [];
                for (let i = start; i <= end; i++) pages.push(i);
                return (
                  <div className="flex items-center gap-1">
                    <button
                      disabled={page <= 1}
                      onClick={() => fetchCertificates(page - 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"/>
                      </svg>
                    </button>
                    {pages.map((p) => (
                      <button
                        key={p}
                        onClick={() => fetchCertificates(p)}
                        className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-all duration-200 ${
                          p === page
                            ? "bg-green-500 text-white shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      disabled={page >= totalPages}
                      onClick={() => fetchCertificates(page + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </button>
                  </div>
                );
              })()}

              {/* Search */}
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by ID, degree..."
                  className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 transition w-full sm:w-60"
                />
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="status">Status</option>
              </select>

            </div>
          </div>

          {loading ? (
            /* Loading skeleton */
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <svg className="w-8 h-8 animate-spin text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 11-6.219-8.56"/>
              </svg>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Loading certificates…</p>
            </div>

          ) : filtered.length === 0 ? (

            /* Empty state */
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="9" y1="13" x2="15" y2="13"/>
                  <line x1="9" y1="17" x2="15" y2="17"/>
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">No certificates found</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Issued certificates will appear here.</p>
            </div>

          ) : (

            /* Table */
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800 text-left">
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Certificate ID</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student ID</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Degree</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Issued</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {filtered.map((cert) => (
                      <tr
                        key={cert._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                        onClick={() => setExpandedId(expandedId === cert._id ? null : cert._id)}
                      >
                        <td className="px-6 py-4 font-semibold text-green-600 dark:text-green-400 whitespace-nowrap">{cert.certificateId}</td>
                        <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{cert.studentId}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{cert.degree}</td>
                        <td className="px-6 py-4">{statusBadge(cert.status)}</td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">{fmt(cert.createdAt)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              title="View details"
                              onClick={(e) => { e.stopPropagation(); setExpandedId(expandedId === cert._id ? null : cert._id); }}
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                              </svg>
                            </button>
                            <button className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Revoke">
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Expanded detail panel */}
              {expandedId && (() => {
                const cert = certificates.find((c) => c._id === expandedId);
                if (!cert) return null;
                return (
                  <div
                    className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 px-8 py-6"
                    style={{ animation: "fadeSlideIn 0.3s ease forwards" }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">Certificate Details</h3>
                      <button
                        onClick={() => setExpandedId(null)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { label: "Certificate ID",      value: cert.certificateId },
                        { label: "Student ID",           value: cert.studentId },
                        { label: "Personal ID",          value: cert.personalId },
                        { label: "Degree",               value: cert.degree },
                        { label: "Major",                value: cert.major },
                        { label: "GPA",                  value: cert.gpa != null ? cert.gpa.toFixed(2) : "—" },
                        { label: "Graduation Date",      value: fmt(cert.graduationDate) },
                        { label: "Status",               value: cert.status?.charAt(0).toUpperCase() + cert.status?.slice(1) },
                        { label: "Public",               value: cert.isPublic ? "Yes" : "No" },
                        { label: "Issued On",            value: fmt(cert.createdAt) },
                        { label: "IPFS Hash",            value: cert.ipfsHash || "—" },
                        { label: "Blockchain Tx",        value: cert.blockchainTxHash || "—" },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-white dark:bg-gray-900 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700">
                          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">{label}</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white break-all">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Page {page} of {totalPages} · {total} total
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={page <= 1}
                      onClick={() => fetchCertificates(page - 1)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      disabled={page >= totalPages}
                      onClick={() => fetchCertificates(page + 1)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>

          )}
        </div>

      </main>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {showIssueModal && <IssueCertificateModal onClose={() => setShowIssueModal(false)} />}
    </div>
  );
}
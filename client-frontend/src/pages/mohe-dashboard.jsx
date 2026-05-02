import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

/* ─── Log Detail Modal ──────────────────────────────────────────────────── */
function LogDetailModal({ log, onClose }) {
  if (!log) return null;

  const fields = [
    { label: "Log ID",       value: log._id || log.id },
    { label: "Action Type",  value: log.actionType },
    { label: "Performed By (Role)", value: log.performedBy?.roleModel ?? "—" },
    { label: "Performed By (ID)",   value: log.performedBy?._id ?? "—" },
    { label: "Target ID",    value: log.targetId ?? "—" },
    { label: "IP Address",   value: log.ipAddress ?? "—" },
    { label: "Created At",   value: log.createdAt ? new Date(log.createdAt).toLocaleString() : "—" },
    { label: "Updated At",   value: log.updatedAt ? new Date(log.updatedAt).toLocaleString() : "—" },
  ];

  let parsedDetails = log.details;
  try {
    if (log.details) {
      const parsed = JSON.parse(log.details);
      parsedDetails = JSON.stringify(parsed, null, 2);
    }
  } catch (e) {
    // Keep as string if it's not JSON
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "popIn 0.2s ease forwards" }}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white">Log Details</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Modal body */}
        <div className="px-6 py-5 grid grid-cols-1 gap-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            {fields.map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{label}</span>
                <span className="text-sm text-gray-800 dark:text-gray-200 font-medium break-all">
                  {String(value)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-1 mt-2">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Details</span>
            <pre className="text-xs text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-950 p-3 rounded-lg border border-gray-100 dark:border-gray-800 overflow-x-auto font-mono whitespace-pre-wrap break-all">
              {parsedDetails || "—"}
            </pre>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.94) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ─── Main Dashboard ────────────────────────────────────────────────────── */
export default function MoheDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  /* Stats */
  const [stats, setStats] = useState({ totalIssued: 0, totalRevoked: 0, totalVerifications: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  /* Audit log */
  const [auditLogs, setAuditLogs]     = useState([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [pagination, setPagination]   = useState({ page: 1, totalPages: 1, total: 0 });
  const [selectedLog, setSelectedLog] = useState(null);

  /* ── Fetch stats ────────────────────────────────────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`${API_URL}/api/certificates/stats`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (res.ok) setStats(data);
      } catch {
        console.error("Failed to fetch stats");
      } finally {
        setStatsLoading(false);
      }
    })();
  }, []);

  /* ── Fetch audit logs ───────────────────────────────────────────────── */
  const fetchLogs = useCallback(async (page = 1) => {
    setLogsLoading(true);
    try {
      const res  = await fetch(`${API_URL}/api/audit-logs?page=${page}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (res.ok) {
        setAuditLogs(data.data ?? []);
        setPagination({ page: data.page, totalPages: data.totalPages, total: data.total });
      }
    } catch {
      console.error("Failed to fetch audit logs");
    } finally {
      setLogsLoading(false);
    }
  }, []);

  useEffect(() => { fetchLogs(1); }, [fetchLogs]);

  /* ── Stat card definitions ──────────────────────────────────────────── */
  const statCards = [
    {
      label:     "Total Issued",
      value:     stats.totalIssued,
      sub:       "Certificates issued",
      subColor:  "text-green-500 dark:text-green-400",
      iconBg:    "bg-green-100 dark:bg-green-900/50",
      iconColor: "text-green-600 dark:text-green-400",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <polyline points="9 15 11 17 15 13"/>
        </svg>
      ),
    },
    {
      label:     "Total Revoked",
      value:     stats.totalRevoked,
      sub:       "Certificates revoked",
      subColor:  "text-red-500 dark:text-red-400",
      iconBg:    "bg-red-100 dark:bg-red-900/50",
      iconColor: "text-red-600 dark:text-red-400",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="9" y1="14" x2="15" y2="14"/>
        </svg>
      ),
    },
    {
      label:     "Total Verifications",
      value:     stats.totalVerifications,
      sub:       "Verification requests",
      subColor:  "text-teal-500 dark:text-teal-400",
      iconBg:    "bg-teal-100 dark:bg-teal-900/50",
      iconColor: "text-teal-600 dark:text-teal-400",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      ),
    },
  ];

  /* ── Badge helper ───────────────────────────────────────────────────── */
  const getLogBadge = (actionType) => {
    const a = actionType?.toLowerCase() ?? "";
    if (a.includes("issue") || a.includes("creat"))
      return "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700";
    if (a.includes("revok") || a.includes("delet"))
      return "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-700";
    if (a.includes("verif"))
      return "bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-700";
    if (a.includes("login") || a.includes("access"))
      return "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-700";
    return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600";
  };

  /* ── Render ─────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <main className="pt-20 px-8 max-w-7xl mx-auto">

        {/* Header */}
        <div
          className="mt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          style={{ animation: "fadeSlideIn 0.5s ease forwards" }}
        >
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              MOHE Admin Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
              Ministry of Higher Education — System-Wide Statistics
            </p>
          </div>

          <button
            onClick={() => navigate("/university-management")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            University Management
          </button>
        </div>

        {/* Stats Cards — 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-8">
          {statCards.map((card, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl px-5 py-5 flex items-start justify-between shadow-sm"
              style={{ animation: `fadeSlideIn 0.5s ease ${i * 0.08}s both` }}
            >
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
                {statsLoading ? (
                  <div className="h-9 w-24 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
                ) : (
                  <p className="text-4xl font-extrabold text-gray-900 dark:text-white">
                    {card.value.toLocaleString()}
                  </p>
                )}
                <p className={`text-xs font-medium ${card.subColor}`}>{card.sub}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${card.iconBg} ${card.iconColor} flex items-center justify-center shrink-0`}>
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Audit Log */}
        <div className="mt-8 mb-16 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">

          {/* Audit log header */}
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </div>
              <h2 className="text-base font-extrabold text-gray-900 dark:text-white">Audit Log</h2>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {!logsLoading && `${pagination.total} total entries`}
            </span>
          </div>

          {/* Table or states */}
          {logsLoading ? (
            <div className="flex flex-col gap-3 p-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : auditLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="9" y1="13" x2="15" y2="13"/>
                  <line x1="9" y1="17" x2="15" y2="17"/>
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">No audit logs yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">System activity will appear here.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800/50 text-left">
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Timestamp</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action Type</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Performed By</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Target ID</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">IP Address</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {auditLogs.map((log, i) => {
                      let detailsSummary = log.details;
                      try {
                        if (log.details) {
                          const parsed = JSON.parse(log.details);
                          detailsSummary = Object.entries(parsed)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(", ");
                        }
                      } catch (e) {
                        // fallback to string
                      }

                      return (
                        <tr
                          key={log._id ?? log.id ?? i}
                          onClick={() => setSelectedLog(log)}
                          className="hover:bg-blue-50/40 dark:hover:bg-blue-900/10 transition-colors cursor-pointer group"
                          title="Click to view full details"
                        >
                          {/* Timestamp */}
                          <td className="px-6 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap text-xs">
                            {log.createdAt ? new Date(log.createdAt).toLocaleString() : "—"}
                          </td>

                          {/* Action Type badge */}
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getLogBadge(log.actionType)}`}>
                              {log.actionType ? log.actionType.replace(/_/g, ' ') : "—"}
                            </span>
                          </td>

                          {/* Performed By */}
                          <td className="px-6 py-4">
                            {log.performedBy ? (
                              <div className="flex flex-col gap-0.5">
                                <span className="text-gray-700 dark:text-gray-300 font-medium text-xs">
                                  {log.performedBy.roleModel || "System"}
                                </span>
                                <span className="text-gray-400 dark:text-gray-500 text-[10px] font-mono">
                                  ID: {log.performedBy._id ? log.performedBy._id.slice(-6) : "—"}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-400 dark:text-gray-500">—</span>
                            )}
                          </td>

                          {/* Target ID */}
                          <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs font-mono truncate max-w-[100px]">
                            {log.targetId ? `...${String(log.targetId).slice(-8)}` : "—"}
                          </td>

                          {/* IP Address */}
                          <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs font-mono whitespace-nowrap">
                            {log.ipAddress ?? "—"}
                          </td>

                          {/* Details (summary) */}
                          <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs max-w-[200px]">
                            <span className="truncate block font-mono text-[10px]">
                              {detailsSummary ? (
                                detailsSummary.length > 50
                                  ? `${detailsSummary.slice(0, 50)}…`
                                  : detailsSummary
                              ) : "—"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Page {pagination.page} of {pagination.totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fetchLogs(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      ← Prev
                    </button>
                    {/* Page number pills */}
                    {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, idx) => {
                      const p = idx + 1;
                      return (
                        <button
                          key={p}
                          onClick={() => fetchLogs(p)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                            pagination.page === p
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => fetchLogs(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Log detail popup */}
      <LogDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

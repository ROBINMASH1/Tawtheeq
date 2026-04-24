import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';


export default function MoheDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalCertificates: 0,
    activeUniversities: 0,
    totalVerifications: 0,
    activeStudents: 0,
  });

  const [auditLogs, setAuditLogs] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(true);
  const navigate = useNavigate();
  

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/mohe/stats", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await response.json();
        if (response.ok) setStats(data);
      } catch {
        console.error("Failed to fetch stats");
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Fetch audit logs
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/mohe/audit-logs", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await response.json();
        if (response.ok) setAuditLogs(data);
      } catch {
        console.error("Failed to fetch audit logs");
      } finally {
        setLogsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const statCards = [
    {
      label: "Total Certificates",
      value: stats.totalCertificates.toLocaleString(),
      sub: "",
      subColor: "text-green-500 dark:text-green-400",
      iconBg: "bg-green-100 dark:bg-green-900/50",
      iconColor: "text-green-600 dark:text-green-400",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
      ),
    },
    {
      label: "Active Universities",
      value: stats.activeUniversities.toLocaleString(),
      sub: "Across Jordan",
      subColor: "text-blue-500 dark:text-blue-400",
      iconBg: "bg-blue-100 dark:bg-blue-900/50",
      iconColor: "text-blue-600 dark:text-blue-400",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
    },
    {
      label: "Total Verifications",
      value: stats.totalVerifications.toLocaleString(),
      sub: "",
      subColor: "text-green-500 dark:text-green-400",
      iconBg: "bg-teal-100 dark:bg-teal-900/50",
      iconColor: "text-teal-600 dark:text-teal-400",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      ),
    },
    {
      label: "Active Students",
      value: stats.activeStudents.toLocaleString(),
      sub: "Registered users",
      subColor: "text-purple-500 dark:text-purple-400",
      iconBg: "bg-purple-100 dark:bg-purple-900/50",
      iconColor: "text-purple-600 dark:text-purple-400",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87"/>
          <path d="M16 3.13a4 4 0 010 7.75"/>
        </svg>
      ),
    },
  ];

  const getLogBadge = (action) => {
    const a = action?.toLowerCase();
    if (a?.includes("issue") || a?.includes("creat"))
      return "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700";
    if (a?.includes("revok") || a?.includes("delet"))
      return "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-700";
    if (a?.includes("verif"))
      return "bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-700";
    if (a?.includes("login") || a?.includes("access"))
      return "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-700";
    return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600";
  };

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

          {/* University Management Button */}
          <button
            onClick={() => navigate('/university-management')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            University Management
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
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
                  <p className="text-4xl font-extrabold text-gray-900 dark:text-white">{card.value}</p>
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
            <span className="text-xs text-gray-400 dark:text-gray-500">System-wide activity</span>
          </div>

          {logsLoading ? (
            <div className="flex flex-col gap-3 p-6">
              {[...Array(4)].map((_, i) => (
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
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50 text-left">
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Timestamp</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Target</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">University</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {auditLogs.map((log, i) => (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap text-xs">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 text-xs font-bold">
                            {(log.userName || "?")[0].toUpperCase()}
                          </div>
                          <span className="text-gray-800 dark:text-gray-300 font-medium">{log.userName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getLogBadge(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{log.target || "—"}</td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{log.university || "—"}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                          log.status === "success" ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            log.status === "success" ? "bg-green-500" : "bg-red-500"
                          }`} />
                          {log.status === "success" ? "Success" : "Failed"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>



      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
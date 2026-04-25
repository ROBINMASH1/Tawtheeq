import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
export default function AdminDashboard() {
  const { user } = useAuth();

  // placeholder — replace with fetch later
  const stats = { totalCertificates: 0, recentActivities: 0 };
  const certificates = []; // replace with fetched data later

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <main className="pt-20 px-8 max-w-7xl mx-auto">

        {/* Header */}
        <div
          className="mt-8 bg-white dark:bg-gray-900 rounded-2xl px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm"
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
            <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 active:scale-95 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-200">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

          {/* Total Certificates */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl px-6 py-5 shadow-sm border border-green-200 dark:border-green-800 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Certificates</p>
              <p className="text-4xl font-extrabold text-gray-900 dark:text-white mt-1">{stats.totalCertificates}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Issued on blockchain</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <polyline points="9 12 11 14 15 10"/>
              </svg>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl px-6 py-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Recent Activities</p>
              <p className="text-4xl font-extrabold text-gray-900 dark:text-white mt-1">{stats.recentActivities}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Last 7 days</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
          </div>

        </div>

        {/* Certificates Table */}
        <div className="mt-8 mb-16 bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden">

          {/* Table header */}
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <h2 className="text-base font-extrabold text-gray-900 dark:text-white">Issued Certificates</h2>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">

              {/* Search */}
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or ID..."
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
                <option value="name">Student Name</option>
                <option value="status">Status</option>
              </select>

            </div>
          </div>

          {certificates.length === 0 ? (

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
              <p className="text-gray-500 dark:text-gray-400 font-medium">No certificates issued yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Issued certificates will appear here.</p>
            </div>

          ) : (

            /* Table */
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800 text-left">
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Certificate ID</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student Name</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Degree</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {certificates.map((cert, i) => (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-green-600 dark:text-green-400">{cert.certId}</td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{cert.studentName}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{cert.degree}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          cert.status === "verified"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                            : cert.status === "revoked"
                            ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                            : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            cert.status === "verified" ? "bg-green-500"
                            : cert.status === "revoked" ? "bg-red-500"
                            : "bg-yellow-500"
                          }`} />
                          {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="View">
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
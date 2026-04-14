import { useAuth } from '../context/AuthContext';

export default function StudentDashboard() {
  const { user } = useAuth();

  // placeholder — replace with real fetch later
  const stats = {
    totalCredentials: 0,
    verified: 0,
    recentShares: 0,
  };

  const credentials = []; // replace with fetched data later

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <main className="pt-20 px-8 max-w-7xl mx-auto">

        {/* Welcome banner */}
        <div
          className="mt-8 bg-white dark:bg-gray-900 rounded-2xl px-8 py-6 flex items-center justify-between shadow-sm"
          style={{ animation: 'fadeSlideIn 0.5s ease forwards' }}
        >
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              Welcome back, {user?.name || 'Student'} 👋
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
              Manage and share your academic credentials securely.
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-2xl">
            {(user?.name || user?.identifier || 'S')[0].toUpperCase()}
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

          {/* Total Credentials */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl px-6 py-5 shadow-sm border border-green-200 dark:border-green-800 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Credentials</p>
              <p className="text-4xl font-extrabold text-gray-900 dark:text-white mt-1">{stats.totalCredentials}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </div>
          </div>

          {/* Verified */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl px-6 py-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Verified</p>
              <p className="text-4xl font-extrabold text-gray-900 dark:text-white mt-1">{stats.verified}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <polyline points="9 12 11 14 15 10"/>
              </svg>
            </div>
          </div>

          {/* Recent Shares */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl px-6 py-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Recent Shares</p>
              <p className="text-4xl font-extrabold text-gray-900 dark:text-white mt-1">{stats.recentShares}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"/>
                <circle cx="6" cy="12" r="3"/>
                <circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
            </div>
          </div>

        </div>

        {/* My Credentials */}
        <div className="mt-10 mb-16">
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6">My Credentials</h2>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden">

            {credentials.length === 0 ? (

              /* Empty state */
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="12" y1="18" x2="12" y2="12"/>
                    <line x1="9" y1="15" x2="15" y2="15"/>
                  </svg>
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">No credentials yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Your issued credentials will appear here.</p>
              </div>

            ) : (

              /* Credential cards */
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {credentials.map((cred, i) => (
                  <div key={i} className="px-8 py-6 flex items-start justify-between gap-6">

                    {/* Left info */}
                    <div className="flex flex-col gap-3 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">{cred.title}</h3>
                        {cred.verified && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400 border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                              <polyline points="22 4 12 14.01 9 11.01"/>
                            </svg>
                            Verified
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-500 dark:text-gray-400">{cred.institution}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 mt-1">
                        <div>
                          <p className="text-xs text-gray-400 dark:text-gray-500">Certificate ID</p>
                          <p className="text-sm font-semibold text-green-600 dark:text-green-400 mt-0.5">{cred.certId}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 dark:text-gray-500">IPFS Hash</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">{cred.ipfsHash}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 dark:text-gray-500">Issue Date</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">{cred.issueDate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 dark:text-gray-500">Transaction Hash</p>
                          <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 mt-0.5">{cred.txHash}</p>
                        </div>
                      </div>
                    </div>

                    {/* Right actions */}
                    <div className="flex flex-col gap-2 shrink-0">
                      <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                        View
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                          <polyline points="7 10 12 15 17 10"/>
                          <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Download
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-green-500 hover:bg-green-600 text-white transition-colors">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="18" cy="5" r="3"/>
                          <circle cx="6" cy="12" r="3"/>
                          <circle cx="18" cy="19" r="3"/>
                          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                        </svg>
                        Share
                      </button>
                    </div>

                  </div>
                ))}
              </div>

            )}
          </div>
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
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import API_URL from "../config/api.js"


export default function StudentDashboard() {
  const { user } = useAuth();

  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);
  const [shareResult, setShareResult] = useState(null);
  const [shareLoading, setShareLoading] = useState(null);
  const [downloadLoading, setDownloadLoading] = useState(null);
  const [copied, setCopied] = useState(false);
  const [recentShares, setRecentShares] = useState(0);

  const token = localStorage.getItem('token');
  const authHeader = { Authorization: `Bearer ${token}` };

  const stats = {
    totalCredentials: credentials.length,
    verified: credentials.filter(c => c.status === 'verified').length,
    recentShares: recentShares,
  };

  useEffect(() => {
    const fetchCertificates = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/certificates/my`, { headers: authHeader });
        const data = await res.json();
        if (res.ok) setCredentials(data.certificates || data.data || data);
      } catch {
        console.error('Failed to fetch certificates');
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  const handleDownload = async (cert) => {
    setDownloadLoading(cert.certificateId);
    try {
      const res = await fetch(`${API_URL}/api/certificates/${cert.certificateId}/download`, {
        headers: authHeader,
      });
      if (!res.ok) { alert('Download failed.'); return; }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${cert.certificateId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Download failed. Please try again.');
    } finally {
      setDownloadLoading(null);
    }
  };

  const handleShare = async (cert) => {
    setShareLoading(cert.certificateId);
    try {
      const res = await fetch(`${API_URL}/api/certificates/${cert.certificateId}/share`, {
        method: 'POST',
        headers: authHeader,
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message || 'Share failed.'); return; }
      setShareResult({ link: data.shareLink || data.link || data.url || data.shareUrl, certId: cert.certificateId });
      setRecentShares(prev => prev + 1);
    } catch {
      alert('Share failed. Please try again.');
    } finally {
      setShareLoading(null);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareResult.link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (val) => {
    if (!val) return '—';
    return new Date(val).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const truncate = (str, len = 16) => str ? `${str.slice(0, len)}...` : '—';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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

          <div className="bg-white dark:bg-gray-900 rounded-2xl px-6 py-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Recent Shares</p>
              <p className="text-4xl font-extrabold text-gray-900 dark:text-white mt-1">{stats.recentShares}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
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

            {loading ? (
              <div className="flex flex-col gap-4 p-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : credentials.length === 0 ? (
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
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800 text-left">
                      <th className="px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Certificate ID</th>
                      <th className="px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Degree</th>
                      <th className="px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Major</th>
                      <th className="px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">GPA</th>
                      <th className="px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Graduation</th>
                      <th className="px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {credentials.map((cert, i) => (
                      <tr
                        key={i}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        {/* Certificate ID — clickable */}
                        <td className="px-5 py-4">
                          <button
                            onClick={() => setSelectedCert(cert)}
                            className="text-green-600 dark:text-green-400 font-semibold hover:underline text-left"
                          >
                            {truncate(cert.certificateId, 14)}
                          </button>
                        </td>
                        <td className="px-5 py-4 text-gray-800 dark:text-gray-200 font-medium">{cert.degree || '—'}</td>
                        <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{cert.major || '—'}</td>
                        <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{cert.gpa ?? '—'}</td>
                        <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{formatDate(cert.graduationDate)}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            cert.status === 'verified'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cert.status === 'verified' ? 'bg-green-500' : 'bg-red-500'}`} />
                            {cert.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            {/* Download */}
                            <button
                              onClick={() => handleDownload(cert)}
                              disabled={downloadLoading === cert.certificateId}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                            >
                              {downloadLoading === cert.certificateId ? (
                                <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
                              ) : (
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                                  <polyline points="7 10 12 15 17 10"/>
                                  <line x1="12" y1="15" x2="12" y2="3"/>
                                </svg>
                              )}
                              Download
                            </button>

                            {/* Share */}
                            <button
                              onClick={() => handleShare(cert)}
                              disabled={shareLoading === cert.certificateId}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-green-500 hover:bg-green-600 text-white disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                            >
                              {shareLoading === cert.certificateId ? (
                                <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
                              ) : (
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                                </svg>
                              )}
                              Share
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
        </div>

      </main>

      {/* ── Certificate Detail Popup ── */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 flex flex-col gap-5"
            style={{ animation: 'fadeSlideIn 0.3s ease forwards' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <polyline points="9 12 11 14 15 10"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900 dark:text-white">Certificate Details</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{selectedCert.certificateId}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="w-8 h-8 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Certificate ID', value: selectedCert.certificateId },
                { label: 'Status', value: selectedCert.status },
                { label: 'Degree', value: selectedCert.degree },
                { label: 'Major', value: selectedCert.major },
                { label: 'GPA', value: selectedCert.gpa },
                { label: 'Graduation Date', value: formatDate(selectedCert.graduationDate) },
                { label: 'IPFS Hash', value: selectedCert.ipfsHash },
                { label: 'Transaction Hash', value: selectedCert.blockchainTxHash },
                { label: 'Personal ID', value: selectedCert.personalId },
                { label: 'Public', value: selectedCert.isPublic ? 'Yes' : 'No' },
                { label: 'Issued At', value: formatDate(selectedCert.createdAt) },
                { label: 'Updated At', value: formatDate(selectedCert.updatedAt) },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3">
                  <p className="text-xs text-gray-400 dark:text-gray-500">{label}</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5 break-all">{value ?? '—'}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedCert(null)}
              className="w-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── Share Link Popup ── */}
      {shareResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl w-full max-w-md shadow-2xl p-6 flex flex-col gap-5"
            style={{ animation: 'fadeSlideIn 0.3s ease forwards' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-gray-900 dark:text-white">Share Certificate</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Anyone with this link can verify the credential</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3">
              <p className="text-sm text-gray-700 dark:text-gray-300 flex-1 break-all">{shareResult.link}</p>
              <button
                onClick={handleCopyLink}
                className="shrink-0 w-8 h-8 rounded-lg text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white flex items-center justify-center transition-colors"
              >
                {copied ? (
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

            <button
              onClick={() => { setShareResult(null); setCopied(false); }}
              className="w-full bg-green-500 hover:bg-green-600 active:scale-95 text-white font-semibold py-3 rounded-xl transition-all"
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
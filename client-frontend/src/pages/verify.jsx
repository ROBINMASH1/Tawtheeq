import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API_URL from '../config/api';
import LoadingScreen from "../componant/LoadingScreen";


export default function Verify() {
  const { certificateId } = useParams();
  const [certId, setCertId] = useState(certificateId || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);   // certificate object
  const [error, setError] = useState('');

  const handleVerify = async (idToVerify = certId) => {
    // If called from a button click, `idToVerify` might be an event object.
    const id = (typeof idToVerify === 'string' ? idToVerify : certId).trim();
    if (!id) { setError('Please enter a Certificate ID.'); return; }

    setError('');
    setResult(null);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/verify/${encodeURIComponent(id)}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || data.error || 'Certificate not found or could not be verified.');
      } else {
        setResult(data.certificate);
      }
    } catch {
      setError('Blockchain services are temprory disabled. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (certificateId) {
      handleVerify(certificateId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [certificateId]);

  const isVerified = result?.status === 'verified';

  // Safely convert a value that may be a populated object { _id, name } or a plain string
  const str = (v) => {
    if (v == null) return '—';
    if (typeof v === 'object') return v.name ?? v.title ?? '—';
    return String(v);
  };

  const fmt = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 sm:px-8 py-12 sm:py-20 transition-colors duration-300">
      {loading && <LoadingScreen />}
      <div className="max-w-3xl mx-auto">

        {/* Page Heading */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Credential Verification Portal
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Instantly verify the authenticity of academic credentials on the blockchain
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-gray-200 dark:bg-gray-800 rounded-2xl p-4 sm:p-8 shadow-sm mb-6 transition-colors duration-300">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Certificate ID
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={certId}
              onChange={(e) => { setCertId(e.target.value); setError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              placeholder="Enter certificate ID (e.g., TAWQ-69F-2026-N8N6EN)"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 transition"
            />
            <button
              onClick={handleVerify}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-colors sm:w-auto w-full"
            >
              {loading ? (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              )}
              {loading ? 'Verifying…' : 'Verify'}
            </button>
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-3">
            Enter the unique certificate ID provided on the academic credential
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-5 py-4 rounded-2xl mb-6">
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {/* ── RESULT CARD ── */}
        {result && (
          <div
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden transition-colors duration-300"
            style={{ animation: 'fadeSlideIn 0.4s ease forwards' }}
          >
            {/* Result heading */}
            <div className="px-4 sm:px-8 pt-6 sm:pt-8 pb-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">
                Verification Results
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Certificate details retrieved from the blockchain
              </p>
            </div>

            <div className="px-4 sm:px-8 py-4 sm:py-6 flex flex-col gap-6">

              {/* Status row */}
              <div className="flex items-center gap-3">
                {isVerified ? (
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                  </div>
                )}
                <div>
                  <p className="text-base font-extrabold text-gray-900 dark:text-white">Certificate Status</p>
                  <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold ${isVerified
                    ? 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400'
                    : 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400'
                    }`}>
                    {isVerified ? 'Valid' : result.status ?? 'Unknown'}
                  </span>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                {[
                  { label: 'Certificate ID', value: result.certificateId ?? '—' },
                  { label: 'Student Name', value: result.user?.name ?? '—' },
                  { label: 'University Name', value: str(result.university) },
                  { label: 'Degree', value: str(result.degree) },
                  { label: 'Student Major', value: str(result.major) },
                  { label: 'GPA', value: result.gpa != null ? result.gpa.toFixed(2) : '—' },
                  { label: 'Graduation Date', value: fmt(result.graduationDate) },
                ].map(({ label, value }) => (
                  <div key={label} className="border-b border-gray-100 dark:border-gray-800 pb-4">
                    <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">
                      {label}
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white break-all">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Blockchain verified footer */}
              <div className={`flex items-start gap-3 rounded-xl px-5 py-4 ${isVerified
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                }`}>
                <svg className={`w-5 h-5 mt-0.5 shrink-0 ${isVerified ? 'text-green-500' : 'text-red-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <div>
                  <p className={`text-sm font-bold ${isVerified ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                    {isVerified ? 'Blockchain Verified' : 'Verification Failed'}
                  </p>
                  <p className={`text-xs mt-0.5 ${isVerified ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                    {isVerified
                      ? 'This certificate has been cryptographically verified on the blockchain and the details match the original record.'
                      : 'This certificate could not be verified on the blockchain.'}
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* How Verification Works — hidden once a result is shown */}
        {!result && (
          <div className="bg-gray-200 dark:bg-gray-800 rounded-2xl p-4 sm:p-8 shadow-sm transition-colors duration-300">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              How Verification Works
            </h2>
            <ol className="flex flex-col gap-6">
              {[
                { title: 'Certificate ID Lookup:', desc: 'The system searches the blockchain for a record matching the provided certificate ID.' },
                { title: 'Record Verification:', desc: 'The certificate data is retrieved from the blockchain and verified for authenticity.' },
                { title: 'Status Check:', desc: 'The system checks if the certificate is valid or revoked.' },
                { title: 'Results Display:', desc: 'All certificate details are displayed including student information and academic credentials.' },
              ].map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300 w-5 shrink-0">{i + 1}.</span>
                  <div>
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{step.title}</span>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
import { useState } from 'react';

export default function Verify() {
  const [certId, setCertId] = useState('');

  const handleVerify = () => {
    // verification logic goes here
    console.log('Verifying:', certId);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-8 py-20">
      <div className="max-w-3xl mx-auto">

        {/* Page Heading */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Credential Verification Portal
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Instantly verify the authenticity of academic credentials on the blockchain
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-gray-200 dark:bg-gray-800 rounded-2xl p-8 shadow-sm mb-6">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Certificate ID
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              placeholder="Enter certificate ID (e.g., CERT-2024-001234)"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 transition"
            />
            <button
              onClick={handleVerify}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              Verify
            </button>
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-3">
            Enter the unique certificate ID provided on the academic credential
          </p>
        </div>

        {/* How Verification Works Card */}
        <div className="bg-gray-200 dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            How Verification Works
          </h2>
          <ol className="flex flex-col gap-6">
            {[
              {
                title: 'Certificate ID Lookup:',
                desc: 'The system searches the blockchain for a record matching the provided certificate ID.',
              },
              {
                title: 'Record Verification:',
                desc: 'The certificate data is retrieved from the blockchain and verified for authenticity.',
              },
              {
                title: 'Status Check:',
                desc: 'The system checks if the certificate is valid or revoked.',
              },
              {
                title: 'Results Display:',
                desc: 'All certificate details are displayed including student information and academic credentials.',
              },
            ].map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300 w-5 shrink-0">
                  {i + 1}.
                </span>
                <div>
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{step.title}</span>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

      </div>
    </div>
  );
}
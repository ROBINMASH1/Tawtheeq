import { Link } from 'react-router-dom';

export default function HowItWorks() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative px-8 py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900 -z-10" />
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-sm font-bold tracking-widest uppercase px-4 py-2 rounded-full">
            The Process
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight max-w-4xl">
            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Tawtheeq</span> Works
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
            Discover how we leverage blockchain technology to make credential issuance, management, and verification secure and frictionless.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="px-8 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-24">
            
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
              <div className="flex-1 order-2 md:order-1 relative group">
                <div className="absolute inset-0 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-[3rem] transform group-hover:-rotate-3 transition-transform duration-500" />
                <div className="relative bg-white dark:bg-gray-800 p-8 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-700">
                  <div className="w-full aspect-video bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl flex items-center justify-center">
                    <svg className="w-32 h-32 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex-1 order-1 md:order-2 flex flex-col gap-6">
                <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl font-bold">1</div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Issue Credentials</h2>
                <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                  Universities securely issue academic credentials. Each document is cryptographically hashed, and the digital fingerprint is permanently recorded on the blockchain, while the encrypted file is stored on IPFS.
                </p>
                <ul className="space-y-4 mt-2">
                  {['Automated batch issuance', 'Cryptographic signature generation', 'Permanent blockchain record'].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
              <div className="flex-1 flex flex-col gap-6">
                <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center text-2xl font-bold">2</div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Student Management</h2>
                <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                  Students receive their credentials instantly in their personal account. They maintain complete ownership and can selectively share public links or download verifiable PDF copies of their certificates.
                </p>
                <ul className="space-y-4 mt-2">
                  {['Self-sovereign identity', 'One-click credential sharing', 'Privacy-first granular controls'].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 relative group">
                <div className="absolute inset-0 bg-purple-500/10 dark:bg-purple-500/20 rounded-[3rem] transform group-hover:rotate-3 transition-transform duration-500" />
                <div className="relative bg-white dark:bg-gray-800 p-8 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-700">
                  <div className="w-full aspect-video bg-purple-50 dark:bg-purple-900/20 rounded-3xl flex items-center justify-center">
                    <svg className="w-32 h-32 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
              <div className="flex-1 order-2 md:order-1 relative group">
                <div className="absolute inset-0 bg-green-500/10 dark:bg-green-500/20 rounded-[3rem] transform group-hover:-rotate-3 transition-transform duration-500" />
                <div className="relative bg-white dark:bg-gray-800 p-8 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-700">
                  <div className="w-full aspect-video bg-green-50 dark:bg-green-900/20 rounded-3xl flex items-center justify-center">
                    <svg className="w-32 h-32 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex-1 order-1 md:order-2 flex flex-col gap-6">
                <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 flex items-center justify-center text-2xl font-bold">3</div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Instant Verification</h2>
                <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                  Employers and institutions can instantly verify a credential by entering its unique ID or scanning a QR code. The system checks the blockchain to confirm the credential's authenticity in milliseconds.
                </p>
                <ul className="space-y-4 mt-2">
                  {['No more background check delays', '100% fraud-proof cryptographic validation', 'Completely free public verification'].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-24 bg-blue-600 dark:bg-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center gap-8">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">Experience it yourself</h2>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl leading-relaxed">
            Verify a sample certificate and see how fast and reliable the blockchain verification process is.
          </p>
          <div className="flex gap-4">
            <Link to="/verify" className="px-8 py-4 bg-white text-blue-600 hover:bg-gray-50 font-bold rounded-xl shadow-lg transition-colors">
              Verify a Credential
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

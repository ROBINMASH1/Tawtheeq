import { Link } from 'react-router-dom';


export default function Home() {
  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">

      {/* Hero Section */}
      <section
        className="relative min-h-screen bg-cover bg-center bg-no-repeat flex items-end"
        style={{ backgroundImage: "url('/blockchain.png')" }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50 dark:bg-black/70" />

        {/* Content — left aligned */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-8 pb-32 flex flex-col items-start gap-6">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 border border-white/30 bg-green/300 backdrop-blur-sm text-white text-lg px-4 py-2 rounded-full">
            ✦ Verify credentials with confidence using our decentralized platform. ✦
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-6xl font-extrabold text-white leading-tight">
              Secure Academic
            </h1>
            <h1 className="text-6xl font-extrabold text-green-500 leading-tight">
              Credentials Forever
            </h1>
          </div>

          {/* Description */}
          <p className="text-white/80 text-xl max-w-xl leading-relaxed bg-green/300 font backdrop-blur-sm px-6 py-4 rounded-lg">
            Decentralized credential management powered by blockchain and IPFS.
            Issue, verify, and manage academic certificates with complete transparency and security.
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-4 mt-2">
            <Link
              to="/login"
              className="flex items-center text-lg gap-2 bg-green-800 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Login →
            </Link>
            <Link
              to="/verify"
              className="flex items-center gap-2 border border-white/40 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Verify Credentials
            </Link>
          </div>

        </div>
      </section>

      {/* Blockchain Security Section */}
      <section className="bg-gray-50 dark:bg-gray-900 py-24 px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">

          {/* Heading */}
          <div className="text-center mb-20">
            <span className="inline-block bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-4">
              Powered by Blockchain
            </span>
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
              Why Blockchain is the <span className="text-green-500">Safest</span> Choice
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Traditional credential systems are vulnerable to fraud and manipulation.
              Blockchain changes everything by making records permanent, transparent, and tamper-proof.
            </p>
          </div>

          {/* Main feature — left image, right text */}
          <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">

            {/* Image */}
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="w-72 h-72 bg-green-100 dark:bg-green-900/20 rounded-3xl flex items-center justify-center shadow-lg">
                  <svg className="w-40 h-40 text-green-500 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ animation: 'float 4s ease-in-out infinite' }}>
                    <rect x="2" y="7" width="20" height="14" rx="2"/>
                    <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
                    <line x1="12" y1="12" x2="12" y2="16"/>
                    <circle cx="12" cy="12" r="1" fill="currentColor"/>
                  </svg>
                </div>
                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 shadow-lg rounded-2xl px-4 py-2 flex items-center gap-2"
                  style={{ animation: 'float 4s ease-in-out infinite 0.5s' }}>
                  <span className="w-3 h-3 bg-green-400 rounded-full inline-block"></span>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Tamper-Proof</span>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 shadow-lg rounded-2xl px-4 py-2 flex items-center gap-2"
                  style={{ animation: 'float 4s ease-in-out infinite 1s' }}>
                  <span className="w-3 h-3 bg-blue-400 rounded-full inline-block"></span>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Decentralized</span>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="flex-1 flex flex-col gap-6">
              <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                Immutable Records You Can Trust
              </h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                Once a credential is written to the blockchain, it cannot be altered, deleted, or forged —
                not by hackers, not by institutions, not by anyone. Every certificate gets a unique
                cryptographic hash that acts as a permanent digital fingerprint.
              </p>
              <div className="flex flex-col gap-4">
                {[
                  { icon: '🔐', text: 'SHA-256 cryptographic hashing on every credential' },
                  { icon: '🌐', text: 'Distributed across thousands of nodes worldwide' },
                  { icon: '📜', text: 'Permanent audit trail for every issued certificate' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 shadow-sm">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                ),
                color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400',
                title: 'Zero Single Point of Failure',
                desc: 'No central server to hack or take down. The network stays alive as long as even one node exists.',
              },
              {
                icon: (
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
                  </svg>
                ),
                color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-500 dark:text-purple-400',
                title: 'Full Transparency',
                desc: 'Any employer or institution can verify a credential publicly without contacting anyone.',
              },
              {
                icon: (
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                ),
                color: 'bg-green-100 dark:bg-green-900/30 text-green-500 dark:text-green-400',
                title: 'Instant Verification',
                desc: 'Verification happens in seconds on-chain — no paperwork, no waiting, no phone calls.',
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-300"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                  {card.icon}
                </div>
                <h4 className="text-base font-bold text-gray-900 dark:text-white">{card.title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

        </div>

        {/* Floating animation keyframes */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-12px); }
          }
        `}</style>
      </section>

      {/* Why Tawtheeq Section */}
      <section className="bg-green-200 dark:bg-gray-900 py-24 px-8">
        <div className="max-w-7xl mx-auto">

          {/* Heading */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
              Why Tawtheeq!?
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              The future of academic credential verification
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Card 1: Immutable Security */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 flex flex-col gap-6 shadow-sm">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Immutable Security</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  Credentials stored on blockchain with cryptographic hashing ensure tamper-proof records that last forever.
                </p>
              </div>
            </div>

            {/* Card 2: Student Ownership */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 flex flex-col gap-6 shadow-sm">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Student Ownership</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  Students maintain full control over their credentials with selective sharing.
                </p>
              </div>
            </div>

            {/* Card 3: Instant Verification */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 flex flex-col gap-6 shadow-sm">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Instant Verification</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  Employers verify credentials in seconds without contacting institutions, reducing friction and fraud.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

     {/* How It Works Section */}
      <section className="bg-white dark:bg-gray-950 py-24 px-8">
        <div className="max-w-7xl mx-auto">

          {/* Heading */}
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Three simple steps to decentralized credential verification
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

            {/* Step 1 */}
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-20 h-20 rounded-full bg-cyan-100 dark:bg-cyan-900/30 border-2 border-cyan-400 dark:border-cyan-500 flex items-center justify-center">
                <span className="text-2xl font-bold text-cyan-500 dark:text-cyan-400">1</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Issue Credentials</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  Institutions upload credentials to IPFS and record the hash on blockchain.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-400 dark:border-purple-500 flex items-center justify-center">
                <span className="text-2xl font-bold text-purple-500 dark:text-purple-400">2</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Manage Credentials</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  Students access their portal to view, download, and share their credentials.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-20 h-20 rounded-full bg-teal-100 dark:bg-teal-900/30 border-2 border-teal-400 dark:border-teal-500 flex items-center justify-center">
                <span className="text-2xl font-bold text-teal-500 dark:text-teal-400">3</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Verify Instantly</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  Anyone can verify credential authenticity by entering the certificate ID to check the blockchain record.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Future sections go here */}

    </div>
  );
}
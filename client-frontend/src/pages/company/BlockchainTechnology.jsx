import { Link } from 'react-router-dom';

export default function BlockchainTechnology() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative px-8 py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-gray-900 -z-10" />
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-8">
          <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-sm font-bold tracking-widest uppercase px-4 py-2 rounded-full border border-indigo-200 dark:border-indigo-800">
            Technology
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight max-w-4xl">
            The Power of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600">Blockchain</span>
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
            Unpacking the decentralized infrastructure that makes Tawtheeq the most secure credential verification platform in the world.
          </p>
        </div>
      </section>

      {/* Core Concepts */}
      <section className="px-8 py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Why Blockchain?</h2>
            <p className="text-lg text-gray-500 dark:text-gray-400">Transforming vulnerability into absolute certainty.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🔒',
                title: 'Immutability',
                desc: 'Once a credential is cryptographically signed and hashed on the blockchain, it cannot be altered, tampered with, or deleted. It serves as a permanent source of truth.',
              },
              {
                icon: '🌐',
                title: 'Decentralization',
                desc: 'No single point of failure. By distributing data across thousands of nodes worldwide, we eliminate the risk of centralized servers being hacked or going offline.',
              },
              {
                icon: '⚡',
                title: 'Instant Validation',
                desc: 'Verifiers don\'t need to call universities or wait weeks for background checks. The blockchain provides mathematical proof of authenticity in a fraction of a second.',
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:-translate-y-1 transition-transform">
                <div className="text-4xl mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Details */}
      <section className="px-8 py-24">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1 flex flex-col gap-8">
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">Our Infrastructure</h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                Tawtheeq bridges cutting-edge Web3 technologies to deliver a seamless Web2 user experience. We combine the security of smart contracts with the efficiency of decentralized storage.
              </p>
            </div>
            
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-1">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Chaincode</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    Automated, self-executing chaincode handles the issuance and revocation logic on our Hyperledger Fabric network. It ensures that only authorized institutions can issue credentials and permanently logs the transaction state.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 mt-1">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">IPFS Integration</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    To keep the blockchain fast and cheap, heavy credential files (like PDFs) are encrypted and stored on the InterPlanetary File System (IPFS). Only the lightweight cryptographic hash is stored on-chain.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-1">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Cryptographic Hashing</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    Every certificate is run through a SHA-256 algorithm to generate a unique hash. If even a single pixel or letter of the certificate is changed, the hash completely changes, instantly flagging the document as forged.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full max-w-md lg:max-w-none">
            <div className="relative aspect-square bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[3rem] p-8 shadow-2xl flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
              <svg className="w-3/4 h-3/4 text-white/90 drop-shadow-2xl" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-24 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center gap-8">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">Trust, mathematically proven.</h2>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl leading-relaxed">
            See the technology in action. Verify a credential and witness the speed and security of our blockchain infrastructure.
          </p>
          <div className="flex gap-4">
            <Link to="/verify" className="px-8 py-4 bg-indigo-500 text-white hover:bg-indigo-600 font-bold rounded-xl shadow-lg transition-colors">
              Verify a Credential Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

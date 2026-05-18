import { Link } from 'react-router-dom';
import ScrollReveal from '../../componant/ScrollReveal';

export default function AboutTawtheeq() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative px-8 py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-900 -z-10" />
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-8">
          <ScrollReveal direction="bottom" delay={0.1} y={30}>
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 text-sm font-bold tracking-widest uppercase px-4 py-2 rounded-full">
              Our Story
            </div>
          </ScrollReveal>
          <ScrollReveal direction="bottom" delay={0.25} y={40}>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight max-w-4xl">
              Redefining <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">Trust</span> in Education
            </h1>
          </ScrollReveal>
          <ScrollReveal direction="bottom" delay={0.4} y={30}>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
              Tawtheeq is on a mission to eliminate academic fraud and streamline credential verification globally using the power of blockchain and decentralized technology.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="px-8 py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <ScrollReveal direction="left" delay={0.1}>
            <div className="flex flex-col gap-6 p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-500 dark:text-blue-400">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-lg">
                To empower students with true ownership of their academic achievements, while providing institutions and employers with an instant, immutable, and cryptographically secure verification process.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="right" delay={0.2}>
            <div className="flex flex-col gap-6 p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-500 dark:text-purple-400">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Vision</h2>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-lg">
                A world where academic credentials are universally recognized and trusted without friction. We envision a seamless ecosystem where verification takes seconds, not weeks.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Core Values */}
      <section className="px-8 py-24">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="bottom" y={40}>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Our Core Values</h2>
              <p className="text-lg text-gray-500 dark:text-gray-400">The principles that drive our innovation</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Transparency', desc: 'Open, auditable, and clear processes backed by public ledger technology.', icon: '🔍', color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
              { title: 'Security', desc: 'State-of-the-art cryptography to ensure data integrity and privacy.', icon: '🛡️', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
              { title: 'Empowerment', desc: 'Putting individuals in complete control of their personal credentials.', icon: '⚡', color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
              { title: 'Innovation', desc: 'Constantly pushing the boundaries of what decentralized tech can achieve.', icon: '💡', color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' }
            ].map((value, i) => (
              <ScrollReveal key={i} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.12} y={30}>
                <div className="flex flex-col items-center text-center gap-4 group">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm group-hover:-translate-y-2 transition-transform ${value.color}`}>
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{value.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{value.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-24 bg-green-600 dark:bg-green-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
        <ScrollReveal direction="bottom" y={50}>
          <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center gap-8">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white">Join the Verification Revolution</h2>
            <p className="text-green-100 text-lg md:text-xl max-w-2xl leading-relaxed">
              Ready to experience the future of secure, instant, and frictionless credential verification?
            </p>
            <div className="flex gap-4">
              <Link to="/login" className="px-8 py-4 bg-white text-green-600 hover:bg-gray-50 font-bold rounded-xl shadow-lg transition-colors">
                Get Started
              </Link>
              <Link to="/verify" className="px-8 py-4 bg-transparent border-2 border-white/30 text-white hover:bg-white/10 font-bold rounded-xl transition-colors">
                Try Verification
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}

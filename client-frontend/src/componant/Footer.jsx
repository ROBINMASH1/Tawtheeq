import { Link } from 'react-router-dom';
 
export default function Footer() {
  return (
    <footer className="bg-gray-300 dark:bg-gray-900 text-gray-600 dark:text-gray-400 font-sans">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
 
          {/* Column 1: Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg">
                <Link to="/"><img src="badge.png" alt="Tawtheeq Logo" /></Link>
              </div>
              <Link to="/" className="font-semibold text-lg">
                <span className="text-gray-900 dark:text-white">Taw</span>
                <span className="text-green-500">theeq</span>
              </Link>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Decentralized credential management powered by blockchain and IPFS.
              Issue, verify, and manage academic certificates with complete transparency and security.
            </p>
            <div className="flex gap-3 mt-2">
              {[
                "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z",
                "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
                "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
                "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
              ].map((path, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
 
          {/* Column 2: Credentials */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold tracking-widest text-gray-900 dark:text-white uppercase">Credentials</h4>
            <ul className="flex flex-col gap-3">
              <li><Link to="/verify" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Verify a Certificate</Link></li>
              <li><Link to="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/login" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Student Login</Link></li>
            </ul>
          </div>
 
          {/* Column 3: Company */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold tracking-widest text-gray-900 dark:text-white uppercase">Company</h4>
            <ul className="flex flex-col gap-3">
              <li><Link to="/about" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">About Tawtheeq</Link></li>
              <li><Link to="/how-it-works" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/blockchain" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Blockchain Technology</Link></li>
              <li><Link to="/faq" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
 
          {/* Column 4: Legal & Trust */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold tracking-widest text-gray-900 dark:text-white uppercase">Legal & Trust</h4>
            <ul className="flex flex-col gap-3">
              <li><Link to="/privacy" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/data-security" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Data Security</Link></li>
              <li><Link to="/compliance" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Compliance</Link></li>
              <li><Link to="/open-source" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Open Source</Link></li>
            </ul>
          </div>
 
        </div>

        {/* Trust badges */}
        <div className="mt-16 pt-10 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              ),
              title: 'Blockchain Secured',
              desc: 'All credentials are cryptographically signed and stored on-chain.',
            },
            {
              icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              ),
              title: 'Instantly Verifiable',
              desc: 'Anyone can verify a credential in seconds — no phone calls needed.',
            },
            {
              icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
                </svg>
              ),
              title: 'Decentralized & Open',
              desc: 'No single point of failure. Built on IPFS and public blockchain.',
            },
          ].map((badge, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0">
                {badge.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{badge.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
 
      {/* Bottom bar */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-sm text-gray-400 dark:text-gray-500">© 2026 Tawtheeq. All rights reserved.</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">Powered by Blockchain & IPFS</p>
        </div>
      </div>
    </footer>
  );
}
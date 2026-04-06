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
            ✦ Verify your credentials with confidence using our decentralized platform. ✦
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
              to="/"
              className="flex items-center text-lg gap-2 bg-green-800 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Get started →
            </Link>
            <Link
              to="/"
              className="flex items-center gap-2 border border-white/40 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Verify Credentials
            </Link>
          </div>

        </div>
      </section>

      {/* Future sections go here */}

    </div>
  );
}
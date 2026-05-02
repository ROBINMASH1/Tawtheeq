import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function NotFound() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Tiny delay so CSS animations trigger after first paint
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-6 overflow-hidden relative">

      {/* ── Decorative background grid ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59,130,246,.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,.04) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* ── Soft radial glow ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div
          className="w-[600px] h-[600px] rounded-full opacity-20 dark:opacity-10"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.35) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* ── Main card ── */}
      <div
        className="relative z-10 flex flex-col items-center text-center max-w-md w-full"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >

        {/* Ministry seal / broken doc icon */}
        <div
          className="relative mb-8"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "scale(1)" : "scale(0.85)",
            transition: "opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s",
          }}
        >
          {/* Outer ring */}
          <div className="w-28 h-28 rounded-full border-2 border-dashed border-blue-200 dark:border-blue-900 flex items-center justify-center animate-slow-spin">
            <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 flex items-center justify-center shadow-inner">
              <svg
                className="w-10 h-10 text-blue-400 dark:text-blue-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="9" y1="13" x2="15" y2="13" />
                <line x1="9" y1="17" x2="12" y2="17" />
                {/* X mark */}
                <line x1="13.5" y1="15.5" x2="16.5" y2="18.5" strokeWidth="1.8" />
                <line x1="16.5" y1="15.5" x2="13.5" y2="18.5" strokeWidth="1.8" />
              </svg>
            </div>
          </div>

          {/* Error dot */}
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-white dark:border-gray-950 shadow-md" />
        </div>

        {/* 404 number */}
        <div
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s",
          }}
        >
          <p className="text-xs font-bold tracking-[0.3em] text-blue-500 dark:text-blue-400 uppercase mb-2">
            Error
          </p>
          <h1
            className="font-extrabold text-gray-900 dark:text-white leading-none select-none"
            style={{ fontSize: "clamp(5rem, 16vw, 8rem)", letterSpacing: "-0.04em" }}
          >
            404
          </h1>
        </div>

        {/* Message */}
        <div
          className="mt-4"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease 0.3s, transform 0.5s ease 0.3s",
          }}
        >
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Page Not Found
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">
            The page you're looking for doesn't exist or has been moved.
            Please check the URL or return to the dashboard.
          </p>
        </div>

        {/* Divider */}
        <div
          className="my-8 w-16 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"
          style={{
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.5s ease 0.4s",
          }}
        />

        {/* Actions */}
        <div
          className="flex items-center gap-3 flex-wrap justify-center"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.5s ease 0.45s, transform 0.5s ease 0.45s",
          }}
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm transition-all duration-200 active:scale-95"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Go Back
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all duration-200 active:scale-95"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Back to Dashboard
          </button>
        </div>

        {/* Footer note */}
        <p
          className="mt-10 text-xs text-gray-400 dark:text-gray-600"
          style={{
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.5s ease 0.55s",
          }}
        >
          Ministry of Higher Education — Certificate Management System
        </p>
      </div>

      <style>{`
        @keyframes slow-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .animate-slow-spin {
          animation: slow-spin 18s linear infinite;
        }
      `}</style>
    </div>
  );
}

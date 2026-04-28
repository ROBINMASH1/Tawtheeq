import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-8">

        {/* Shield Icon with Pulse Ring */}
        <div className="relative flex items-center justify-center">

          {/* Outer pulse ring */}
          <motion.div
            className="absolute rounded-full border-2 border-emerald-400"
            initial={{ width: 80, height: 80, opacity: 0.8 }}
            animate={{ width: 140, height: 140, opacity: 0 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />

          {/* Middle pulse ring */}
          <motion.div
            className="absolute rounded-full border border-emerald-500"
            initial={{ width: 80, height: 80, opacity: 0.6 }}
            animate={{ width: 120, height: 120, opacity: 0 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
          />

          {/* Shield icon container */}
          <motion.div
            className="relative w-20 h-20 rounded-2xl bg-emerald-500 flex items-center justify-center overflow-hidden"
            style={{
              boxShadow: "0 0 30px rgba(16, 185, 129, 0.6), 0 0 60px rgba(16, 185, 129, 0.2)",
            }}
            animate={{ boxShadow: [
              "0 0 30px rgba(16,185,129,0.6), 0 0 60px rgba(16,185,129,0.2)",
              "0 0 50px rgba(16,185,129,0.9), 0 0 80px rgba(16,185,129,0.4)",
              "0 0 30px rgba(16,185,129,0.6), 0 0 60px rgba(16,185,129,0.2)",
            ]}}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Shield SVG */}
            <svg
              className="w-10 h-10 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>

            {/* Scan line */}
            <motion.div
              className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent"
              style={{ opacity: 0.9 }}
              initial={{ top: "0%" }}
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Shimmer overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>

        {/* Loading text */}
        <motion.p
          className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 tracking-widest uppercase"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          Loading...
        </motion.p>

        {/* Progress dots */}
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-emerald-500"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.4, 1, 0.4],
                boxShadow: [
                  "0 0 0px rgba(16,185,129,0)",
                  "0 0 10px rgba(16,185,129,0.9)",
                  "0 0 0px rgba(16,185,129,0)",
                ],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}

          {/* Pill dot */}
          <motion.div
            className="h-2 rounded-full bg-emerald-400"
            animate={{
              width: ["8px", "24px", "8px"],
              opacity: [0.4, 1, 0.4],
              boxShadow: [
                "0 0 0px rgba(16,185,129,0)",
                "0 0 12px rgba(16,185,129,0.9)",
                "0 0 0px rgba(16,185,129,0)",
              ],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.6,
            }}
          />
        </div>

      </div>
    </div>
  );
}
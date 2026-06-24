import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRef, useEffect, useState, useCallback } from 'react';
import ScrollReveal from '../componant/ScrollReveal';
/* ──────────────────────────── Stat Counter ──────────────────────────── */
const stats = [
  { value: '50K+', label: 'Credentials Issued' },
  { value: '120+', label: 'Institutions' },
  { value: '99.9%', label: 'Uptime' },
  { value: '<2s', label: 'Verification Time' },
];

/* ──────────────────────────── Blockchain Cards Data ──────────────────── */
const blockchainCards = [
  {
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    color: 'from-blue-500 to-cyan-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    title: 'Zero Single Point of Failure',
    desc: 'No central server to hack or take down. The network stays alive as long as even one node exists.',
  },
  {
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
    ),
    color: 'from-purple-500 to-pink-400',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    title: 'Full Transparency',
    desc: 'Any employer or institution can verify a credential publicly without contacting anyone.',
  },
  {
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    color: 'from-green-500 to-emerald-400',
    bg: 'bg-green-50 dark:bg-green-900/20',
    title: 'Instant Verification',
    desc: 'Verification happens in seconds on-chain — no paperwork, no waiting, no phone calls.',
  },
];

/* ──────────────────────────── Why Tawtheeq Data ────────────────────── */
const whyCards = [
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    ),
    gradient: 'from-green-400 to-emerald-600',
    title: 'Immutable Security',
    desc: 'Credentials stored on blockchain with cryptographic hashing ensure tamper-proof records that last forever.',
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
      </svg>
    ),
    gradient: 'from-blue-400 to-indigo-600',
    title: 'Student Ownership',
    desc: 'Students maintain full control over their credentials with selective sharing and privacy controls.',
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    gradient: 'from-cyan-400 to-teal-600',
    title: 'Instant Verification',
    desc: 'Employers verify credentials in seconds without contacting institutions, reducing friction and fraud.',
  },
];

/* ──────────────────────────── How It Works Data ─────────────────────── */
const steps = [
  {
    num: '01',
    color: 'from-cyan-400 to-blue-500',
    ring: 'ring-cyan-400/30',
    title: 'Issue Credentials',
    desc: 'Institutions upload credentials to IPFS and record the hash on blockchain for permanent storage.',
  },
  {
    num: '02',
    color: 'from-purple-400 to-pink-500',
    ring: 'ring-purple-400/30',
    title: 'Manage Credentials',
    desc: 'Students access their portal to view, download, and selectively share their verified credentials.',
  },
  {
    num: '03',
    color: 'from-teal-400 to-green-500',
    ring: 'ring-teal-400/30',
    title: 'Verify Instantly',
    desc: 'Anyone can verify credential authenticity by entering the certificate ID to check the blockchain record.',
  },
];

/* ──────────────────────────── Feature Bullets ───────────────────────── */
const featureBullets = [
  { icon: <img src="/padlock.png" alt="Security Hash" className="w-5 h-5 object-contain" />, text: 'SHA-256 cryptographic hashing on every credential' },
  { icon: '🌐', text: 'Distributed across university nodes jordanwide' },
  { icon: <img src="/audit.png" alt="Audit Trail" className="w-5 h-5 object-contain" />, text: 'Permanent audit trail for every issued certificate' },
];

/* ═══════════════════════════════════════════════════════════════════════
   VIDEO SECTION COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */
function VideoSection() {
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const progressRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const hideTimer = useRef(null);

  /* ── Auto-play/pause based on scroll visibility ── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const vid = videoRef.current;
        if (!vid) return;
        if (entry.isIntersecting) {
          vid.play().then(() => setIsPlaying(true)).catch(() => {});
        } else {
          vid.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  /* ── Progress updates ── */
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const onTimeUpdate = () => {
      setCurrentTime(vid.currentTime);
      setProgress(vid.duration ? (vid.currentTime / vid.duration) * 100 : 0);
    };
    const onLoaded = () => setDuration(vid.duration);
    vid.addEventListener('timeupdate', onTimeUpdate);
    vid.addEventListener('loadedmetadata', onLoaded);
    return () => {
      vid.removeEventListener('timeupdate', onTimeUpdate);
      vid.removeEventListener('loadedmetadata', onLoaded);
    };
  }, []);

  /* ── Controls auto-hide ── */
  const revealControls = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowControls(false), 3000);
  }, []);

  /* ── Handlers ── */
  const togglePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) { vid.play(); setIsPlaying(true); }
    else { vid.pause(); setIsPlaying(false); }
  };

  const toggleMute = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !vid.muted;
    setIsMuted(vid.muted);
  };

  const handleVolume = (e) => {
    const v = parseFloat(e.target.value);
    const vid = videoRef.current;
    if (!vid) return;
    vid.volume = v;
    vid.muted = v === 0;
    setVolume(v);
    setIsMuted(v === 0);
  };

  const handleSeek = (e) => {
    const bar = progressRef.current;
    const vid = videoRef.current;
    if (!bar || !vid || !vid.duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    vid.currentTime = ratio * vid.duration;
  };

  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    const section = sectionRef.current;
    if (!section) return;
    
    if (!document.fullscreenElement) {
      if (section.requestFullscreen) {
        section.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else if (section.webkitRequestFullscreen) { /* Safari */
        section.webkitRequestFullscreen();
      } else if (section.msRequestFullscreen) { /* IE11 */
        section.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
      }
    }
  };

  return (
    <div className="w-full bg-white dark:bg-gray-950 flex flex-col items-center pt-16 pb-8">
      {/* Title */}
      <ScrollReveal>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-8 px-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
          <span>The Story Behind</span>
          <span className="bg-gradient-to-r from-green-500 to-emerald-400 bg-clip-text text-transparent">
            Tawtheeq
          </span>
          <img src="/badge.png" alt="Badge" className="w-10 h-10 sm:w-11 sm:h-11 object-contain" />
        </h2>
      </ScrollReveal>

      {/* Video Container */}
      <section
        ref={sectionRef}
        className="relative overflow-hidden bg-black mx-auto rounded-xl shadow-2xl"
        style={{ width: 'calc(100% - 2px)', height: 'calc(100vh - 200px)' }}
        onMouseMove={revealControls}
        onTouchStart={revealControls}
      >
      {/* Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src="https://res.cloudinary.com/dh5whdbxf/video/upload/f_auto,q_auto/v1782324281/Tawtheeq_2026_frnbh6.mp4"
        loop
        muted
        playsInline
        onClick={togglePlay}
        style={{ cursor: 'pointer' }}
      />

      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-black/15 pointer-events-none" />

      {/* Play/Pause centre indicator (flashes on click) */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center z-10 group"
          aria-label="Play video"
        >
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center transition-transform group-hover:scale-110 shadow-2xl">
            <svg className="w-9 h-9 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </div>
        </button>
      )}

      {/* ── Control Bar ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 transition-all duration-300"
        style={{ opacity: showControls ? 1 : 0, pointerEvents: showControls ? 'auto' : 'none' }}
      >
        {/* Gradient fade behind controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none rounded-none" style={{ top: '-80px' }} />

        <div className="relative px-5 pb-5 pt-3 flex flex-col gap-2">
          {/* Progress bar */}
          <div
            ref={progressRef}
            className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer group relative"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full relative transition-none"
              style={{ width: `${progress}%` }}
            >
              {/* Scrub thumb */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 -mr-1.5" />
            </div>
          </div>

          {/* Bottom row: controls + time */}
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="text-white hover:text-green-400 transition-colors shrink-0"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              )}
            </button>

            {/* Mute toggle */}
            <button
              onClick={toggleMute}
              className="text-white hover:text-green-400 transition-colors shrink-0"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : volume < 0.5 ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 010 7.07" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
                </svg>
              )}
            </button>

            {/* Volume slider */}
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={isMuted ? 0 : volume}
              onChange={handleVolume}
              className="w-20 accent-green-400 cursor-pointer"
              aria-label="Volume"
            />

            {/* Time */}
            <span className="text-white/70 text-xs font-mono ml-1 shrink-0">
              {fmt(currentTime)} / {fmt(duration)}
            </span>

            {/* Spacer */}
            <div className="flex-grow" />

            {/* Fullscreen toggle */}
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-green-400 transition-colors shrink-0 ml-auto"
              aria-label="Toggle Fullscreen"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
);
}

/* ═══════════════════════════════════════════════════════════════════════
   HOME PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen overflow-hidden">

      {/* ─────────── HERO SECTION ─────────── */}
      <section
        className="relative min-h-screen bg-cover bg-center bg-no-repeat flex items-end"
        style={{ backgroundImage: "url('/blockchain.png')" }}
      >
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 dark:from-black/90 dark:via-black/60 dark:to-black/40" />

        {/* Animated grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(34,197,94,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 pb-20 sm:pb-32 flex flex-col items-start gap-6">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 border border-green-400/30 bg-green-500/10 backdrop-blur-md text-green-300 text-sm px-4 py-2 rounded-full"
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Verify certificates with confidence using our decentralized platform
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
              Secure Academic
            </h1>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
              Credentials Forever
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-white/70 text-lg sm:text-xl max-w-xl leading-relaxed"
          >
            Decentralized credential management powered by blockchain and IPFS.
            Issue, verify, and manage academic certificates with complete transparency and security.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="flex flex-wrap items-center gap-4 mt-2"
          >
            <Link
              to="/login"
              className="group relative flex items-center text-lg gap-2 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white font-semibold px-7 py-3.5 rounded-2xl transition-all duration-300 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:-translate-y-0.5"
            >
              Get Started
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
            <Link
              to="/verify"
              className="flex items-center gap-2 border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-md text-white font-semibold px-7 py-3.5 rounded-2xl transition-all duration-300 hover:-translate-y-0.5"
            >
              Verify Credentials
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─────────── VIDEO SECTION ─────────── */}
      <VideoSection />

      {/* ─────────── STATS BAR ─────────── */}
      <section className="relative -mt-1 z-20 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-900 dark:via-gray-850 dark:to-gray-900 border-t border-green-500/20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <ScrollReveal key={i} delay={i * 0.1} y={30} duration={0.5}>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                    {s.value}
                  </div>
                  <div className="text-sm text-gray-400 mt-1 font-medium">{s.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── BLOCKCHAIN SECURITY SECTION ─────────── */}
      <section className="bg-gray-50 dark:bg-gray-950 py-24 sm:py-32 px-6 sm:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">

          {/* Section heading */}
          <ScrollReveal direction="bottom" y={40}>
            <div className="text-center mb-20">
              <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold tracking-widest uppercase px-5 py-2.5 rounded-full mb-5 border border-green-200 dark:border-green-800/50">
                Powered by Blockchain
              </span>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-5">
                Why Blockchain is the{' '}
                <span className="bg-gradient-to-r from-green-500 to-emerald-400 bg-clip-text text-transparent">Safest</span>{' '}
                Choice
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                Traditional credential systems are vulnerable to fraud and manipulation.
                Blockchain changes everything by making records permanent, transparent, and tamper-proof.
              </p>
            </div>
          </ScrollReveal>

          {/* Main feature row — left illustration, right text */}
          <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">

            {/* Illustration */}
            <ScrollReveal direction="left" className="flex-1 flex justify-center">
              <div className="relative">
                <div className="w-72 h-72 bg-gradient-to-br from-green-100 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 rounded-3xl flex items-center justify-center shadow-2xl shadow-green-500/10 border border-green-200/50 dark:border-green-800/30">
                  <svg className="w-36 h-36 text-green-500 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ animation: 'float 4s ease-in-out infinite' }}>
                    <rect x="2" y="7" width="20" height="14" rx="2" />
                    <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                    <line x1="12" y1="12" x2="12" y2="16" />
                    <circle cx="12" cy="12" r="1" fill="currentColor" />
                  </svg>
                </div>
                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 shadow-xl rounded-2xl px-4 py-2.5 flex items-center gap-2 border border-gray-100 dark:border-gray-700"
                  style={{ animation: 'float 4s ease-in-out infinite 0.5s' }}>
                  <span className="w-3 h-3 bg-green-400 rounded-full inline-block animate-pulse" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Tamper-Proof</span>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 shadow-xl rounded-2xl px-4 py-2.5 flex items-center gap-2 border border-gray-100 dark:border-gray-700"
                  style={{ animation: 'float 4s ease-in-out infinite 1s' }}>
                  <span className="w-3 h-3 bg-blue-400 rounded-full inline-block animate-pulse" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Decentralized</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Text side */}
            <ScrollReveal direction="right" className="flex-1 flex flex-col gap-6">
              <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
                Immutable Records You Can Trust
              </h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-lg">
                Once a credential is written to the blockchain, it cannot be altered, deleted, or forged —
                not by hackers, not by institutions, not by anyone. Every certificate gets a unique
                cryptographic hash that acts as a permanent digital fingerprint.
              </p>
              <div className="flex flex-col gap-3">
                {featureBullets.map((item, i) => (
                  <ScrollReveal key={i} delay={i * 0.12} y={20} duration={0.5}>
                    <div className="flex items-center gap-3 bg-white dark:bg-gray-800/80 rounded-xl px-5 py-3.5 shadow-sm border border-gray-100 dark:border-gray-700/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                      <span className="flex items-center justify-center shrink-0 w-6 h-6">{item.icon}</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{item.text}</span>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Bottom 3 blockchain cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blockchainCards.map((card, i) => (
              <ScrollReveal key={i} delay={i * 0.15} direction={i === 0 ? 'left' : i === 2 ? 'right' : 'bottom'}>
                <div className="group bg-white dark:bg-gray-800/80 rounded-2xl p-7 shadow-sm border border-gray-100 dark:border-gray-700/50 flex flex-col gap-4 hover:-translate-y-2 hover:shadow-xl transition-all duration-400 cursor-default">
                  <div className={`w-13 h-13 rounded-xl flex items-center justify-center bg-gradient-to-br ${card.color} text-white shadow-lg`}>
                    {card.icon}
                  </div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white">{card.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{card.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Float animation keyframes */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-12px); }
          }
        `}</style>
      </section>

      {/* ─────────── WHY TAWTHEEQ SECTION ─────────── */}
      <section className="bg-white dark:bg-gray-900 py-24 sm:py-32 px-6 sm:px-8 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">

          {/* Heading */}
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                Why{' '}
                <span className="bg-gradient-to-r from-green-500 to-emerald-400 bg-clip-text text-transparent">Tawtheeq</span>
                ?
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-lg max-w-lg mx-auto">
                The future of academic credential verification
              </p>
            </div>
          </ScrollReveal>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyCards.map((card, i) => (
              <ScrollReveal key={i} delay={i * 0.15} direction={i === 0 ? 'left' : i === 2 ? 'right' : 'bottom'}>
                <div className="group relative bg-gray-50 dark:bg-gray-800/60 rounded-3xl p-8 flex flex-col gap-6 border border-gray-100 dark:border-gray-700/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-400 overflow-hidden">
                  {/* Gradient accent on hover */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${card.gradient} text-white shadow-lg`}>
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{card.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{card.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── HOW IT WORKS SECTION ─────────── */}
      <section className="bg-gray-50 dark:bg-gray-950 py-24 sm:py-32 px-6 sm:px-8 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">

          {/* Heading */}
          <ScrollReveal>
            <div className="text-center mb-20">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                How It Works
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-lg max-w-lg mx-auto">
                Three simple steps to decentralized credential verification
              </p>
            </div>
          </ScrollReveal>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
            {/* Connector line (desktop only) */}
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-cyan-400 via-purple-400 to-teal-400 opacity-20 rounded-full" />

            {steps.map((step, i) => (
              <ScrollReveal key={i} delay={i * 0.2} direction="bottom">
                <div className="flex flex-col items-center text-center gap-6 relative">
                  {/* Number circle */}
                  <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center ring-8 ${step.ring} shadow-xl`}>
                    <span className="text-2xl font-extrabold text-white">{step.num}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── CTA SECTION ─────────── */}
      <section className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 dark:from-green-800 dark:via-emerald-800 dark:to-teal-800 py-24 sm:py-28 px-6 sm:px-8 relative overflow-hidden">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />

        <ScrollReveal direction="bottom" y={60}>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
              Ready to Secure Your Credentials?
            </h2>
            <p className="text-green-100/80 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Join thousands of institutions and students already using blockchain-powered credential verification.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/login"
                className="group flex items-center gap-2 bg-white text-green-700 font-bold text-lg px-8 py-4 rounded-2xl hover:bg-green-50 transition-all duration-300 shadow-xl shadow-black/10 hover:-translate-y-0.5"
              >
                Get Started Now
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
              <Link
                to="/verify"
                className="flex items-center gap-2 border-2 border-white/30 text-white font-bold text-lg px-8 py-4 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5"
              >
                Verify a Certificate
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
}
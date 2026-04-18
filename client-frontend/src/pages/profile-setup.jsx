import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProfileSetup() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Step 1 state
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);

  // Step 2 state
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);

  // OTP timer & resend
  const [timer, setTimer] = useState(300); // 5 min
  const [resendCount, setResendCount] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  const timerRef = useRef(null);

  // box animation
  const [boxRaised, setBoxRaised] = useState(false);

  useEffect(() => {
    if (otpSent) {
      setTimer(300);
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) { clearInterval(timerRef.current); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [otpSent, resendCount]);

  const formatTimer = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const handleRequestOtp = async () => {
    setOtpError("");
    if (!email || !phone) {
      setOtpError("Please enter both email and phone number.");
      return;
    }
    setRequestLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/students/request-activation-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
         },
        body: JSON.stringify({identifier: user?.identifier, email, phone }),
      });
      const data = await response.json();
      if (!response.ok) {
        setOtpError(data.message || "Please check your email or phone number and try again.");
        return;
      }
      setOtpSent(true);
      setBoxRaised(true);
    } catch {
      setOtpError("Unable to connect to the server. Please try again later.");
    } finally {
      setRequestLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCount >= 3) return;
    setVerifyError("");
    setResendLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/students/request-activation-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({email, phone }),
      });
      const data = await response.json();
      if (!response.ok) {
        setVerifyError(data.message || "Failed to resend OTP.");
        return;
      }
      setResendCount((c) => c + 1);
      setOtp("");
      setVerifyError("");
    } catch {
      setVerifyError("Unable to connect to the server.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setVerifyError("");
    if (!otp) { setVerifyError("Please enter the OTP."); return; }
    if (!newPassword) { setVerifyError("Please enter a new password."); return; }
    if (newPassword !== confirmPassword) { setVerifyError("Passwords do not match."); return; }
    if (timer === 0) { setVerifyError("OTP expired. Please resend."); return; }

    setVerifyLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/students/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
         },
        body: JSON.stringify({
          
          otp,
          email,
          phone,
          password: newPassword,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setVerifyError(data.message || "Invalid OTP. Please try again.");
        return;
      }
      navigate("/student-dashboard");
    } catch {
      setVerifyError("Unable to connect to the server. Please try again later.");
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg flex flex-col gap-6" style={{ animation: "fadeSlideIn 0.6s ease forwards" }}>

        {/* Header */}
        <div className="text-center flex flex-col gap-2">
          <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mx-auto">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Set Up Your Profile</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Complete your profile to activate your account and access your credentials.
          </p>
        </div>

        {/* Step 1 — Contact Info */}
        <div
          className={`bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm flex flex-col gap-4 transition-all duration-500 ${
            boxRaised ? "-translate-y-1 opacity-90" : ""
          }`}
        >
          <h2 className="text-base font-bold text-gray-800 dark:text-white">Contact Information</h2>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={otpSent}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={otpSent}
              placeholder="+962 7X XXX XXXX"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
            />
          </div>

          {/* Error */}
          {otpError && (
            <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {otpError}
            </div>
          )}

          {/* Request OTP button */}
          {!otpSent && (
            <button
              onClick={handleRequestOtp}
              disabled={requestLoading}
              className="w-full bg-green-500 hover:bg-green-600 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
            >
              {requestLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  </svg>
                  Sending OTP...
                </>
              ) : (
                <>
                  Request OTP
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </>
              )}
            </button>
          )}

          {/* Sent confirmation */}
          {otpSent && (
            <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm px-4 py-3 rounded-xl">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              OTP sent to your email. Enter it below within 5 minutes.
            </div>
          )}
        </div>

        {/* Step 2 — OTP + Password */}
        {otpSent && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm flex flex-col gap-4" style={{ animation: "fadeSlideIn 0.4s ease forwards" }}>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-800 dark:text-white">Verify & Set Password</h2>
              {/* Timer */}
              <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                timer > 60
                  ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                  : "bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400"
              }`}>
                ⏱ {formatTimer(timer)}
              </span>
            </div>

            {/* OTP input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">OTP Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter the OTP sent to your email"
                maxLength={6}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 tracking-widest text-center text-lg font-bold transition"
              />
            </div>

            {/* New password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                />
                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  {showPassword ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                />
                <button onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  {showConfirm ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Verify error */}
            {verifyError && (
              <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {verifyError}
              </div>
            )}

            {/* Verify button */}
            <button
              onClick={handleVerifyOtp}
              disabled={verifyLoading || timer === 0}
              className="w-full bg-green-500 hover:bg-green-600 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
            >
              {verifyLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  </svg>
                  Verifying...
                </>
              ) : (
                <>
                  Verify OTP & Activate Account
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </>
              )}
            </button>

            {/* Resend OTP */}
            <div className="flex items-center justify-center gap-2 text-sm">
              {resendCount >= 3 ? (
                <p className="text-red-500 dark:text-red-400 font-medium">
                  Maximum resend attempts reached. Please contact support.
                </p>
              ) : (
                <>
                  <span className="text-gray-500 dark:text-gray-400">Didn't receive it?</span>
                  <button
                    onClick={handleResendOtp}
                    disabled={resendLoading || timer > 0}
                    className="text-green-500 hover:text-green-600 font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    {resendLoading ? "Resending..." : `Resend OTP ${resendCount > 0 ? `(${3 - resendCount} left)` : ""}`}
                  </button>
                </>
              )}
            </div>

          </div>
        )}

      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
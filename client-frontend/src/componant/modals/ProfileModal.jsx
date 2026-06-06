import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import API_URL from "../../config/api";

export default function ProfileModal({ onClose }) {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const authHeader = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
  const isStudent = user?.roleModel?.toLowerCase() === "student";

  // Info state
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [emailLoading, setEmailLoading] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [infoMsg, setInfoMsg] = useState("");
  const [infoErr, setInfoErr] = useState("");

  // OTP state
  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [timer, setTimer] = useState(300);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpErr, setOtpErr] = useState("");

  // Password state
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState("");
  const [pwErr, setPwErr] = useState("");

  // OTP timer
  useEffect(() => {
    if (!otpMode || timer <= 0) return;
    const id = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [otpMode, timer]);

  const fmtTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  // ── Update Email ──
  const handleChangeEmail = async () => {
    setInfoErr(""); setInfoMsg("");
    if (!email) { setInfoErr("Please provide email."); return; }
    if (email === user?.email) { setInfoErr("New email is the same as current email."); return; }
    setEmailLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/students/request-change-email-otp`, {
        method: "POST", headers: authHeader,
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setInfoErr(data.error || data.message || "Request failed."); return; }
      setPendingEmail(email);
      setOtpMode(true);
      setTimer(300);
      setInfoMsg("OTP sent to your new email. Please verify.");
    } catch { setInfoErr("Server error. Please try again."); }
    finally { setEmailLoading(false); }
  };

  // ── Update Phone ──
  const handleChangePhone = async () => {
    setInfoErr(""); setInfoMsg("");
    if (!phone) { setInfoErr("Please provide phone."); return; }
    if (phone === user?.phone) { setInfoErr("New phone is the same as current phone."); return; }
    setPhoneLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/students/change-phone-number`, {
        method: "POST", headers: authHeader,
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) { setInfoErr(data.error || data.message || "Update failed."); return; }
      setInfoMsg(data.message || "Phone number updated successfully.");
    } catch { setInfoErr("Server error. Please try again."); }
    finally { setPhoneLoading(false); }
  };

  // ── Verify email OTP ──
  const handleVerifyOtp = async () => {
    setOtpErr("");
    if (!otp) { setOtpErr("Please enter the OTP."); return; }
    setOtpLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/students/change-email`, {
        method: "POST", headers: authHeader,
        body: JSON.stringify({ otp, email: pendingEmail }),
      });
      const data = await res.json();
      if (!res.ok) { setOtpErr(data.error || data.message || "Verification failed."); return; }
      if (data.token) login(data.token);
      setOtpMode(false);
      setInfoMsg("Email updated successfully!");
      setOtp("");
    } catch { setOtpErr("Server error. Please try again."); }
    finally { setOtpLoading(false); }
  };

  const handleResendOtp = async () => {
    setOtpErr("");
    setOtpLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/students/request-change-email-otp`, {
        method: "POST", headers: authHeader,
        body: JSON.stringify({ email: pendingEmail }),
      });
      const data = await res.json();
      if (!res.ok) { setOtpErr(data.error || "Resend failed."); return; }
      setTimer(300);
    } catch { setOtpErr("Server error."); }
    finally { setOtpLoading(false); }
  };

  // ── Change Password ──
  const handleChangePw = async () => {
    setPwErr(""); setPwMsg("");
    if (!oldPw || !newPw || !confirmPw) { setPwErr("All password fields are required."); return; }
    if (newPw.length < 8) { setPwErr("New password must be at least 8 characters."); return; }
    if (newPw !== confirmPw) { setPwErr("Passwords do not match."); return; }
    setPwLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/change-password`, {
        method: "PATCH", headers: authHeader,
        body: JSON.stringify({ oldPassword: oldPw, password: newPw }),
      });
      const data = await res.json();
      if (!res.ok) { setPwErr(data.error || data.message || "Password change failed."); return; }
      setPwMsg(data.message || "Password changed successfully!");
      setOldPw(""); setNewPw(""); setConfirmPw("");
    } catch { setPwErr("Server error. Please try again."); }
    finally { setPwLoading(false); }
  };

  const getRoleLabel = () => {
    const r = user?.roleModel?.toLowerCase();
    if (r === "student") return "Student";
    if (r === "moheadmin") return "MOHE Admin";
    if (r === "uniuser") return user?.subRole?.toLowerCase() === "uniadmin" ? "University Admin" : "University Staff";
    return "User";
  };

  // Eye icon component
  const EyeBtn = ({ show, toggle }) => (
    <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
      {show ? (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
      ) : (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      )}
    </button>
  );

  const inputCls = "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 transition text-sm";
  const readOnlyCls = "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400 text-sm cursor-not-allowed";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        style={{ animation: "profileSlideIn 0.35s ease forwards" }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
              </svg>
            </button>
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center font-bold text-lg">
              {(user?.name || "U")[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-base font-extrabold text-gray-900 dark:text-white">My Profile</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">{getRoleLabel()}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 transition-all hover:scale-110"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ── LEFT: User Information ── */}
            <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">User Information</h3>
                {!isStudent && <span className="ml-auto text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  Read Only
                </span>}
              </div>

              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Full Name</label>
                <input type="text" value={user?.name || "—"} readOnly className={readOnlyCls} />
              </div>

              {/* Identifier */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {isStudent ? "Personal ID" : "Identifier"}
                </label>
                <input type="text" value={user?.identifier || "—"} readOnly className={readOnlyCls} />
              </div>

              {/* Role */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</label>
                <input type="text" value={getRoleLabel()} readOnly className={readOnlyCls} />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</label>
                {isStudent ? (
                  <div className="flex gap-2">
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className={inputCls} />
                    {!otpMode && (
                      <button onClick={handleChangeEmail} disabled={emailLoading} className="shrink-0 bg-green-500 hover:bg-green-600 active:scale-95 disabled:opacity-60 text-white font-semibold px-4 rounded-xl flex items-center justify-center transition-all text-sm">
                        {emailLoading ? <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg> : "Change"}
                      </button>
                    )}
                  </div>
                ) : (
                  <input type="text" value={user?.email || "—"} readOnly className={readOnlyCls} />
                )}
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone</label>
                {isStudent ? (
                  <div className="flex gap-2">
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+966 5XX XXX XXX" className={inputCls} />
                    {!otpMode && (
                      <button onClick={handleChangePhone} disabled={phoneLoading} className="shrink-0 bg-green-500 hover:bg-green-600 active:scale-95 disabled:opacity-60 text-white font-semibold px-4 rounded-xl flex items-center justify-center transition-all text-sm">
                        {phoneLoading ? <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg> : "Change"}
                      </button>
                    )}
                  </div>
                ) : (
                  <input type="text" value={user?.phone || "—"} readOnly className={readOnlyCls} />
                )}
              </div>

              {/* Info messages */}
              {infoErr && (
                <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {infoErr}
                </div>
              )}
              {infoMsg && (
                <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm px-4 py-3 rounded-xl">
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  {infoMsg}
                </div>
              )}

              {/* OTP Section */}
              {otpMode && (
                <div className="flex flex-col gap-3 bg-white dark:bg-gray-800 border border-green-200 dark:border-green-800 rounded-xl p-4" style={{ animation: "profileSlideIn 0.25s ease forwards" }}>
                  <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">Verify New Email</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Enter the OTP sent to <span className="font-semibold text-gray-900 dark:text-white">{pendingEmail}</span></p>
                  <input type="text" value={otp} onChange={e => setOtp(e.target.value)} onKeyDown={e => e.key === "Enter" && handleVerifyOtp()} placeholder="Enter 6-digit OTP" className={inputCls} />
                  {otpErr && <p className="text-xs text-red-500">{otpErr}</p>}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg px-3 py-2 text-center">
                    {timer > 0 ? (
                      <p className="text-xs text-gray-500 dark:text-gray-400">Expires in <span className="font-bold text-gray-900 dark:text-white">{fmtTime(timer)}</span></p>
                    ) : (
                      <button onClick={handleResendOtp} disabled={otpLoading} className="text-xs font-semibold text-green-600 dark:text-green-400 hover:underline disabled:opacity-50">Resend OTP</button>
                    )}
                  </div>
                  <button onClick={handleVerifyOtp} disabled={otpLoading} className="w-full bg-green-500 hover:bg-green-600 active:scale-95 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all text-sm">
                    {otpLoading ? <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>Verifying…</> : "Verify OTP"}
                  </button>
                </div>
              )}

              {/* Update buttons are now inline with their respective inputs */}
            </div>

            {/* ── RIGHT: Change Password ── */}
            <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">Change Password</h3>
              </div>

              {/* Old Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Current Password <span className="text-red-400">*</span></label>
                <div className="relative">
                  <input type={showOld ? "text" : "password"} value={oldPw} onChange={e => setOldPw(e.target.value)} placeholder="Enter current password" className={inputCls + " pr-11"} />
                  <EyeBtn show={showOld} toggle={() => setShowOld(v => !v)} />
                </div>
              </div>

              {/* New Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">New Password <span className="text-red-400">*</span></label>
                <div className="relative">
                  <input type={showNew ? "text" : "password"} value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="At least 8 characters" className={inputCls + " pr-11"} />
                  <EyeBtn show={showNew} toggle={() => setShowNew(v => !v)} />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Confirm New Password <span className="text-red-400">*</span></label>
                <div className="relative">
                  <input type={showConfirm ? "text" : "password"} value={confirmPw} onChange={e => setConfirmPw(e.target.value)} onKeyDown={e => e.key === "Enter" && handleChangePw()} placeholder="Confirm your new password" className={inputCls + " pr-11"} />
                  <EyeBtn show={showConfirm} toggle={() => setShowConfirm(v => !v)} />
                </div>
              </div>

              {/* Password strength hint */}
              {newPw && (
                <div className="flex items-center gap-2">
                  <div className={`h-1 flex-1 rounded-full transition-all ${newPw.length >= 8 ? "bg-green-400" : "bg-red-400"}`} />
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${newPw.length >= 8 ? "text-green-500" : "text-red-400"}`}>
                    {newPw.length >= 8 ? "Strong enough" : "Too short"}
                  </span>
                </div>
              )}

              {/* Password messages */}
              {pwErr && (
                <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {pwErr}
                </div>
              )}
              {pwMsg && (
                <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm px-4 py-3 rounded-xl">
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  {pwMsg}
                </div>
              )}

              <button onClick={handleChangePw} disabled={pwLoading} className="w-full bg-green-500 hover:bg-green-600 active:scale-95 disabled:opacity-60 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-sm mt-1">
                {pwLoading ? <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>Changing…</> : "Change Password"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes profileSlideIn {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

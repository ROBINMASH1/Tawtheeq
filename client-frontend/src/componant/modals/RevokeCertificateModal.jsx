import { useState } from "react";
import API_URL from "../../config/api";

const REASONS = [
  "Error in Details",
  "Fraudulent Claim",
  "Duplicate",
  "Other",
];

// ── Step indicator ────────────────────────────────────────────────────────────
function Step({ num, label, active, done }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
        done
          ? "bg-green-500 text-white"
          : active
          ? "bg-red-500 text-white"
          : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
      }`}>
        {done ? (
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        ) : num}
      </div>
      <span className={`text-xs font-semibold hidden sm:inline ${
        active ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-500"
      }`}>{label}</span>
    </div>
  );
}

// ── Main Modal ────────────────────────────────────────────────────────────────
export default function RevokeCertificateModal({ onClose, onRevoked }) {
  const [step, setStep] = useState(1); // 1 = form, 2 = confirm password, 3 = success

  // Form
  const [certId, setCertId]       = useState("");
  const [reason, setReason]       = useState("");
  const [customReason, setCustomReason] = useState("");
  const [formError, setFormError] = useState("");

  // Password confirm
  const [password, setPassword]   = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  // Success
  const [result, setResult]       = useState(null);

  const token = localStorage.getItem("token");

  // ── Step 1 → 2 ─────────────────────────────────────────────────────────────
  const handleNext = () => {
    setFormError("");
    if (!certId.trim()) { setFormError("Certificate ID is required."); return; }
    if (!reason)        { setFormError("Please select a reason."); return; }
    if (reason === "Other" && !customReason.trim()) {
      setFormError("Please specify the reason."); return;
    }
    setStep(2);
  };

  // ── Step 2 → submit ─────────────────────────────────────────────────────────
  const handleRevoke = async () => {
    setError("");
    if (!password) { setError("Password is required."); return; }

    const finalReason = reason === "Other" ? customReason.trim() : reason;

    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/certificates/${encodeURIComponent(certId.trim())}/revoke`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason: finalReason, password }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || data.error || "Failed to revoke certificate.");
        return;
      }
      setResult(data);
      setStep(3);
      if (onRevoked) onRevoked();
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden"
        style={{ animation: "fadeSlideIn 0.3s ease forwards" }}
      >

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              </div>
              <div>
                <h2 className="text-base font-extrabold text-gray-900 dark:text-white">Revoke Certificate</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {step === 1 ? "Enter certificate details" : step === 2 ? "Confirm your identity" : "Revocation complete"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-white flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2">
            <Step num={1} label="Details"  active={step === 1} done={step > 1} />
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <Step num={2} label="Confirm"  active={step === 2} done={step > 2} />
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <Step num={3} label="Done"     active={step === 3} done={false} />
          </div>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <>
              {/* Certificate ID */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Certificate ID <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={certId}
                  onChange={(e) => setCertId(e.target.value)}
                  placeholder="e.g. TAWQ-69F-2026-N8N6EN"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400 transition text-sm"
                />
              </div>

              {/* Reason */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Reason for Revocation <span className="text-red-400">*</span>
                </label>
                <select
                  value={reason}
                  onChange={(e) => { setReason(e.target.value); setCustomReason(""); }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400 transition text-sm"
                >
                  <option value="">Select a reason…</option>
                  {REASONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Custom reason */}
              {reason === "Other" && (
                <div className="flex flex-col gap-1.5" style={{ animation: "fadeSlideIn 0.2s ease forwards" }}>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Please specify <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Describe the reason for revocation…"
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400 transition text-sm resize-none"
                  />
                </div>
              )}

              {/* Error */}
              {formError && (
                <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {formError}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 bg-red-500 hover:bg-red-600 active:scale-95 text-white font-semibold py-3 rounded-xl transition-all"
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <>
              {/* Summary */}
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 flex flex-col gap-1.5">
                <p className="text-xs font-semibold text-red-500 dark:text-red-400 uppercase tracking-wide">About to revoke</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white break-all">{certId.trim()}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Reason: <span className="font-semibold">{reason === "Other" ? customReason : reason}</span>
                </p>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Your Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleRevoke()}
                    placeholder="Enter your password to confirm"
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400 transition text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  >
                    {showPw ? (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => { setStep(1); setPassword(""); setError(""); }}
                  className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 rounded-xl transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleRevoke}
                  disabled={loading}
                  className="flex-1 bg-red-500 hover:bg-red-600 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12a9 9 0 11-6.219-8.56"/>
                      </svg>
                      Revoking…
                    </>
                  ) : "Revoke Certificate"}
                </button>
              </div>
            </>
          )}

          {/* ── STEP 3 — Success ── */}
          {step === 3 && result && (
            <>
              <div className="flex flex-col items-center gap-4 py-2">
                <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-base font-extrabold text-gray-900 dark:text-white">Certificate Revoked</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{result.message}</p>
                </div>
              </div>

              {result.txHash && (
                <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3">
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">Blockchain Tx Hash</p>
                  <p className="text-xs font-bold text-gray-900 dark:text-white break-all">{result.txHash}</p>
                </div>
              )}

              <button
                onClick={onClose}
                className="w-full bg-green-500 hover:bg-green-600 active:scale-95 text-white font-semibold py-3 rounded-xl transition-all mt-1"
              >
                Done
              </button>
            </>
          )}

        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

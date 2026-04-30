import { useState, useRef, useEffect } from "react";

// ── Toast Banner ──────────────────────────────────────────────────────────────
function Toast({ toast, onClick }) {
  if (!toast) return null;
  return (
    <div
      onClick={onClick}
      className={`fixed top-6 right-6 z-[100] flex items-start gap-3 px-5 py-4 rounded-2xl shadow-2xl cursor-pointer max-w-sm border transition-all duration-300 ${
        toast.success
          ? "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-800 dark:text-green-300"
          : "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700 text-red-800 dark:text-red-300"
      }`}
      style={{ animation: "slideInRight 0.3s ease forwards" }}
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
        toast.success ? "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400" : "bg-red-100 dark:bg-red-900/50 text-red-500"
      }`}>
        {toast.success ? (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        )}
      </div>
      <div>
        <p className="text-sm font-bold">{toast.success ? "Certificate Issued!" : "Issuance Failed"}</p>
        <p className="text-xs mt-0.5 opacity-80">Click to view details</p>
      </div>
    </div>
  );
}

// ── Detail Box (after clicking toast) ────────────────────────────────────────
function DetailBox({ data, onClose }) {
  if (!data) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl w-full max-w-md shadow-2xl p-6 flex flex-col gap-4"
        style={{ animation: "fadeSlideIn 0.3s ease forwards" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <polyline points="9 12 11 14 15 10"/>
            </svg>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white">Certificate Issued</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Blockchain record confirmed</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {[
            { label: "Certificate ID", value: data.certificateId },
            { label: "Transaction Hash", value: data.txHash },
            { label: "IPFS Hash", value: data.ipfsHash },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3">
              <p className="text-xs text-gray-400 dark:text-gray-500">{label}</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5 break-all">{value || "—"}</p>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors">
          Close
        </button>
      </div>
    </div>
  );
}

// ── Main Modal ────────────────────────────────────────────────────────────────
export default function IssueCertificateModal({ onClose }) {
  const token = localStorage.getItem("token");
  const authHeader = { Authorization: `Bearer ${token}` };

  const [mode, setMode] = useState(null); // null | "single" | "bulk"

  // Single
  const [singleForm, setSingleForm] = useState({ studentId: "", studentPersonalId: "", degree: "", major: "", gpa: "", graduationDate: "" });
  const [pdfFile, setPdfFile] = useState(null);
  const [singleError, setSingleError] = useState("");
  const [singleLoading, setSingleLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const toastTimer = useRef(null);

  // Bulk
  const [csvFile, setCsvFile] = useState(null);
  const [zipFile, setZipFile] = useState(null);
  const [bulkError, setBulkError] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [issueLoading, setIssueLoading] = useState(false);
  const [bulkIssueResult, setBulkIssueResult] = useState(null);
  const [jobProgress, setJobProgress] = useState(null);
  const [jobDone, setJobDone] = useState(false);
  const pollRef = useRef(null);

  useEffect(() => () => { clearTimeout(toastTimer.current); clearInterval(pollRef.current); }, []);

  const showToast = (success, data) => {
    setToast({ success, data });
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  };

  const handleToastClick = () => {
    clearTimeout(toastTimer.current);
    if (toast?.data) setDetailData(toast.data);
    setToast(null);
  };

  // ── Single Submit ──────────────────────────────────────────────────────────
  const handleSingleSubmit = async () => {
    setSingleError("");
    const { studentId, studentPersonalId, degree, major, gpa, graduationDate } = singleForm;
    if (!studentId || !studentPersonalId || !degree || !major || !gpa || !graduationDate || !pdfFile) {
      setSingleError("All fields are required including the PDF file."); return;
    }
    if (studentId.length !== 9) { setSingleError("Student ID must be exactly 9 digits."); return; }
    if (studentPersonalId.length !== 10) { setSingleError("Personal ID must be exactly 10 digits."); return; }
    if (pdfFile.type !== "application/pdf") { setSingleError("Only PDF files are accepted."); return; }

    setSingleLoading(true);
    try {
      const fd = new FormData();
      fd.append("studentId", studentId);
      fd.append("studentPersonalId", studentPersonalId);
      fd.append("degree", degree);
      fd.append("major", major);
      fd.append("gpa", gpa);
      fd.append("graduationDate", graduationDate);
      fd.append("file", pdfFile);

      const res = await fetch("http://localhost:5000/api/certificates/issue", {
        method: "POST", headers: authHeader, body: fd,
      });
      const data = await res.json();
      if (!res.ok) { setSingleError(data.message || "Failed to issue certificate."); showToast(false); return; }
      showToast(true, data);
      setSingleForm({ studentId: "", studentPersonalId: "", degree: "", major: "", gpa: "", graduationDate: "" });
      setPdfFile(null);
    } catch {
      setSingleError("Server error. Please try again."); showToast(false);
    } finally {
      setSingleLoading(false);
    }
  };

  // ── Bulk Preview ───────────────────────────────────────────────────────────
  const handlePreview = async () => {
    setBulkError("");
    if (!csvFile || !zipFile) { setBulkError("Both CSV and ZIP files are required."); return; }
    if (!csvFile.name.endsWith(".csv")) { setBulkError("Please upload a valid .csv file."); return; }
    if (!zipFile.name.endsWith(".zip")) { setBulkError("Please upload a valid .zip file."); return; }

    setPreviewLoading(true);
    try {
      const fd = new FormData();
      fd.append("csv", csvFile);
      fd.append("zip", zipFile);

      const res = await fetch("http://localhost:5000/api/certificates/bulk/preview", {
        method: "POST", headers: authHeader, body: fd,
      });
      const data = await res.json();
      if (!res.ok) { setBulkError(data.message || "Preview failed."); return; }
      setPreviewData(data);
    } catch {
      setBulkError("Server error. Please try again.");
    } finally {
      setPreviewLoading(false);
    }
  };

  // ── Bulk Issue ─────────────────────────────────────────────────────────────
  const handleBulkIssue = async () => {
    setBulkError("");
    setIssueLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/certificates/bulk/issue", {
        method: "POST",
        headers: { ...authHeader, "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: previewData.sessionId, confirmedRows: previewData.confirmedRows }),
      });
      const data = await res.json();
      if (!res.ok) { setBulkError(data.message || "Bulk issue failed."); return; }
      setBulkIssueResult(data);
      startPolling(data.jobId);
    } catch {
      setBulkError("Server error. Please try again.");
    } finally {
      setIssueLoading(false);
    }
  };

  // ── Poll Job Status ────────────────────────────────────────────────────────
  const startPolling = (jobId) => {
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/certificates/bulk/job/${jobId}`, {
          headers: authHeader,
        });
        const data = await res.json();
        setJobProgress(data);
        if (data.status === "done" || data.status === "failed") {
          clearInterval(pollRef.current);
          setJobDone(true);
        }
      } catch {
        clearInterval(pollRef.current);
        setJobDone(true);
      }
    }, 1000);
  };

  const progressPercent = jobProgress
    ? Math.round((jobProgress.processed / jobProgress.total) * 100)
    : 0;

  const InputField = ({ label, name, placeholder, type = "text", maxLength, required }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        value={singleForm[name]}
        onChange={(e) => setSingleForm((p) => ({ ...p, [name]: e.target.value }))}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 transition text-sm"
      />
    </div>
  );

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 bg-gray-50 dark:bg-gray-950 overflow-y-auto">
        <div className="min-h-screen px-4 py-8 max-w-4xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-8 pt-4">
            <div className="flex items-center gap-4">
              {mode && (
                <button
                  onClick={() => { setMode(null); setSingleError(""); setBulkError(""); setPreviewData(null); setBulkIssueResult(null); setJobProgress(null); setJobDone(false); clearInterval(pollRef.current); }}
                  className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center justify-center shadow-sm transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
                  </svg>
                </button>
              )}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 flex items-center justify-center">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="12" y1="18" x2="12" y2="12"/>
                    <line x1="9" y1="15" x2="15" y2="15"/>
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">
                    {mode === "single" ? "Issue Single Certificate" : mode === "bulk" ? "Issue Multiple Certificates" : "Issue Certificate"}
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {mode === "single" ? "Fill in student details below" : mode === "bulk" ? "Upload CSV and ZIP files" : "Choose issuance method"}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center justify-center shadow-sm transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* ── MODE SELECT ── */}
          {!mode && (
            <div className="flex flex-col sm:flex-row gap-5 mt-16" style={{ animation: "fadeSlideIn 0.4s ease forwards" }}>
              <button
                onClick={() => setMode("single")}
                className="flex-1 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-500 rounded-2xl p-8 flex flex-col items-center gap-4 transition-all group shadow-sm"
              >
                <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="12" y1="18" x2="12" y2="12"/>
                    <line x1="9" y1="15" x2="15" y2="15"/>
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">Single Certificate</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Issue one certificate at a time with a form</p>
                </div>
              </button>

              <button
                onClick={() => setMode("bulk")}
                className="flex-1 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 rounded-2xl p-8 flex flex-col items-center gap-4 transition-all group shadow-sm"
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/>
                    <polyline points="13 2 13 9 20 9"/>
                    <line x1="9" y1="14" x2="15" y2="14"/>
                    <line x1="9" y1="18" x2="13" y2="18"/>
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">Multiple Certificates</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Upload CSV and ZIP to issue in bulk</p>
                </div>
              </button>
            </div>
          )}

          {/* ── SINGLE FORM ── */}
          {mode === "single" && (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm" style={{ animation: "fadeSlideIn 0.4s ease forwards" }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Student ID" name="studentId" placeholder="9-digit student ID" maxLength={9} required />
                <InputField label="Student Personal ID" name="studentPersonalId" placeholder="10-digit personal ID" maxLength={10} required />
                <InputField label="Degree" name="degree" placeholder="e.g. Bachelor of Science" required />
                <InputField label="Major" name="major" placeholder="e.g. Computer Science" required />
                <InputField label="GPA" name="gpa" placeholder="e.g. 3.85" required />
                <InputField label="Graduation Date" name="graduationDate" type="date" required />

                {/* PDF Upload */}
                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Certificate PDF <span className="text-red-400">*</span>
                  </label>
                  <label className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl px-4 py-6 cursor-pointer transition-colors ${
                    pdfFile
                      ? "border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-600 bg-gray-50 dark:bg-gray-800"
                  }`}>
                    <svg className={`w-8 h-8 ${pdfFile ? "text-green-500" : "text-gray-400 dark:text-gray-500"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    <p className={`text-sm font-medium ${pdfFile ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}>
                      {pdfFile ? pdfFile.name : "Click to upload PDF"}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Only .pdf files accepted</p>
                    <input type="file" accept=".pdf" className="hidden" onChange={(e) => setPdfFile(e.target.files[0] || null)} />
                  </label>
                </div>
              </div>

              {singleError && (
                <div className="mt-4 flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {singleError}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button onClick={() => setMode(null)} className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 rounded-xl transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleSingleSubmit}
                  disabled={singleLoading}
                  className="flex-1 bg-green-500 hover:bg-green-600 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  {singleLoading ? (
                    <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>Issuing...</>
                  ) : "Issue Certificate"}
                </button>
              </div>
            </div>
          )}

          {/* ── BULK FORM ── */}
          {mode === "bulk" && (
            <div className="flex flex-col gap-5" style={{ animation: "fadeSlideIn 0.4s ease forwards" }}>

              {/* File upload section */}
              {!bulkIssueResult && (
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* CSV Upload */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        CSV File <span className="text-red-400">*</span>
                      </label>
                      <label className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl px-4 py-6 cursor-pointer transition-colors ${
                        csvFile ? "border-blue-400 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 bg-gray-50 dark:bg-gray-800"
                      }`}>
                        <svg className={`w-8 h-8 ${csvFile ? "text-blue-500" : "text-gray-400 dark:text-gray-500"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/>
                          <polyline points="13 2 13 9 20 9"/>
                        </svg>
                        <p className={`text-sm font-medium ${csvFile ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}>
                          {csvFile ? csvFile.name : "Click to upload CSV"}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">Only .csv files accepted</p>
                        <input name="csv" type="file" accept=".csv" className="hidden" onChange={(e) => { setCsvFile(e.target.files[0] || null); setPreviewData(null); }} />
                      </label>
                    </div>

                    {/* ZIP Upload */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        ZIP File <span className="text-red-400">*</span>
                      </label>
                      <label className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl px-4 py-6 cursor-pointer transition-colors ${
                        zipFile ? "border-purple-400 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/20" : "border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-600 bg-gray-50 dark:bg-gray-800"
                      }`}>
                        <svg className={`w-8 h-8 ${zipFile ? "text-purple-500" : "text-gray-400 dark:text-gray-500"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                          <polyline points="17 8 12 3 7 8"/>
                          <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        <p className={`text-sm font-medium ${zipFile ? "text-purple-600 dark:text-purple-400" : "text-gray-500 dark:text-gray-400"}`}>
                          {zipFile ? zipFile.name : "Click to upload ZIP"}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">Only .zip files accepted</p>
                        <input name="zip" type="file" accept=".zip" className="hidden" onChange={(e) => { setZipFile(e.target.files[0] || null); setPreviewData(null); }} />
                      </label>
                    </div>
                  </div>

                  {bulkError && (
                    <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      {bulkError}
                    </div>
                  )}

                  <button
                    onClick={handlePreview}
                    disabled={previewLoading || !csvFile || !zipFile}
                    className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    {previewLoading ? (
                      <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>Generating Preview...</>
                    ) : "Preview"}
                  </button>
                </div>
              )}

              {/* Preview Results */}
              {previewData && !bulkIssueResult && (
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col gap-5" style={{ animation: "fadeSlideIn 0.4s ease forwards" }}>
                  <h3 className="text-base font-extrabold text-gray-900 dark:text-white">Preview Results</h3>

                  {/* Summary badges */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Total", value: previewData.summary.total, color: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300" },
                      { label: "Valid", value: previewData.summary.valid, color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" },
                      { label: "Errors", value: previewData.summary.errors, color: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" },
                    ].map(({ label, value, color }) => (
                      <div key={label} className={`${color} rounded-xl px-4 py-3 text-center`}>
                        <p className="text-2xl font-extrabold">{value}</p>
                        <p className="text-xs font-semibold mt-0.5">{label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Rows table */}
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800 text-left">
                          <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Row</th>
                          <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Student ID</th>
                          <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Name</th>
                          <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Status</th>
                          <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Error</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {previewData.rows.map((row, i) => (
                          <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                            <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{row.rowIndex ?? i + 1}</td>
                            <td className="px-4 py-3 text-gray-800 dark:text-gray-200 font-medium">{row.studentId || "—"}</td>
                            <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{row.name || "—"}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                                row.status === "valid"
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                  : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${row.status === "valid" ? "bg-green-500" : "bg-red-500"}`} />
                                {row.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs text-red-500 dark:text-red-400">{row.error || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button
                    onClick={handleBulkIssue}
                    disabled={issueLoading || previewData.summary.valid === 0}
                    className="w-full bg-green-500 hover:bg-green-600 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    {issueLoading ? (
                      <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>Starting...</>
                    ) : `Issue ${previewData.summary.valid} Valid Certificate${previewData.summary.valid !== 1 ? "s" : ""}`}
                  </button>
                </div>
              )}

              {/* Bulk Issue Started + Progress */}
              {bulkIssueResult && (
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col gap-6" style={{ animation: "fadeSlideIn 0.4s ease forwards" }}>

                  {/* Issued info */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-gray-900 dark:text-white">Bulk Issuance In Progress</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{bulkIssueResult.message}</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  {jobProgress && (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                          {jobProgress.status === "running" ? "Processing..." : jobProgress.status === "done" ? "Completed!" : "Failed"}
                        </span>
                        <span className="font-bold text-gray-900 dark:text-white">{progressPercent}%</span>
                      </div>
                      <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            jobProgress.status === "failed" ? "bg-red-500" : jobProgress.status === "done" ? "bg-green-500" : "bg-blue-500"
                          }`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          { label: "Total", value: jobProgress.total, color: "text-gray-700 dark:text-gray-300" },
                          { label: "Processed", value: jobProgress.processed, color: "text-blue-600 dark:text-blue-400" },
                          { label: "Succeeded", value: jobProgress.succeeded, color: "text-green-600 dark:text-green-400" },
                          { label: "Failed", value: jobProgress.failed, color: "text-red-500 dark:text-red-400" },
                        ].map(({ label, value, color }) => (
                          <div key={label} className="bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 text-center">
                            <p className={`text-2xl font-extrabold ${color}`}>{value ?? 0}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
                          </div>
                        ))}
                      </div>

                      {/* Running indicator */}
                      {jobProgress.status === "running" && (
                        <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 12a9 9 0 11-6.219-8.56"/>
                          </svg>
                          Issuing certificates on the blockchain...
                        </div>
                      )}

                      {/* Results table when done */}
                      {jobDone && jobProgress.results?.length > 0 && (
                        <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800 mt-2">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-gray-50 dark:bg-gray-800 text-left">
                                <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Row</th>
                                <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Status</th>
                                <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Certificate ID</th>
                                <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Error</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                              {jobProgress.results.map((r, i) => (
                                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{r.rowIndex ?? i + 1}</td>
                                  <td className="px-4 py-3">
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                                      r.status === "success"
                                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                        : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                                    }`}>
                                      <span className={`w-1.5 h-1.5 rounded-full ${r.status === "success" ? "bg-green-500" : "bg-red-500"}`} />
                                      {r.status}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-xs text-green-600 dark:text-green-400 font-mono">{r.certificateId || "—"}</td>
                                  <td className="px-4 py-3 text-xs text-red-500 dark:text-red-400">{r.error || "—"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {jobDone && (
                        <button
                          onClick={onClose}
                          className="w-full bg-green-500 hover:bg-green-600 active:scale-95 text-white font-semibold py-3 rounded-xl transition-all mt-2"
                        >
                          Done
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      <Toast toast={toast} onClick={handleToastClick} />

      {/* Detail box after clicking toast */}
      {detailData && <DetailBox data={detailData} onClose={() => setDetailData(null)} />}

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
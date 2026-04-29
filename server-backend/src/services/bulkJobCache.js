/**
 * In-memory store for bulk issuance background job tracking.
 * Stores job status, progress, and results per jobId.
 */
const jobs = new Map();
const TTL = 30 * 60 * 1000; // 30 minutes

function create(jobId, total) {
  jobs.set(jobId, {
    status: 'running',   // running | done | failed
    total,
    succeeded: 0,
    failed: 0,
    processed: 0,
    results: [],
    createdAt: Date.now(),
    expiresAt: Date.now() + TTL,
  });
}

function get(jobId) {
  const entry = jobs.get(jobId);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    jobs.delete(jobId);
    return null;
  }
  return entry;
}

function update(jobId, patch) {
  const entry = jobs.get(jobId);
  if (entry) Object.assign(entry, patch);
}

function pushResult(jobId, result) {
  const entry = jobs.get(jobId);
  if (!entry) return;
  entry.results.push(result);
  entry.processed += 1;
  if (result.status === 'success') entry.succeeded += 1;
  else entry.failed += 1;
}

// Clean up expired jobs every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of jobs) {
    if (now > entry.expiresAt) jobs.delete(key);
  }
}, 15 * 60 * 1000);

module.exports = { create, get, update, pushResult };

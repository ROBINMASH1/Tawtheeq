const crypto = require('crypto');
const User = require('../models/users.model');
const Certificate = require('../models/certificates.model');
const bulkSessionCache = require('../services/bulkSessionCache');
const bulkIssuanceService = require('../services/bulkIssuance.service');
const bulkJobCache = require('../services/bulkJobCache');

// POST /api/certificates/bulk/preview
exports.bulkPreview = async (req, res) => {
  try {
    const csvFile = req.files['csv'] ? req.files['csv'][0] : null;
    const zipFile = req.files['zip'] ? req.files['zip'][0] : null;

    if (!csvFile || !zipFile)
      return res.status(400).json({ error: 'Both CSV and ZIP files are required.' });

    const parsedCsv = bulkIssuanceService.parseCSV(csvFile.buffer);
    if (parsedCsv.error)
      return res.status(400).json({ error: 'Invalid CSV format: ' + parsedCsv.error });

    const rows = parsedCsv.rows;
    if (rows.length === 0)
      return res.status(400).json({ error: 'CSV contains no data rows.' });

    let pdfMap;
    try {
      pdfMap = bulkIssuanceService.extractZipEntries(zipFile.buffer);
    } catch (err) {
      return res.status(400).json({ error: 'Failed to extract ZIP: ' + err.message });
    }

    const personalIds = rows.map(r => r.personalId).filter(Boolean);
    const students = await User.find({ identifier: { $in: personalIds }, roleModel: 'Student' }, 'identifier');
    const existingStudentsMap = new Map(students.map(s => [s.identifier, s._id]));

    const existingCerts = await Certificate.find({
      personalId: { $in: personalIds },
      university: req.universityScope,
    });

    const existingCertsSet = new Set(existingCerts.map(c => `${c.personalId}_${c.degree}`));

    const seenIds = new Set();
    const validatedRows = [];
    let validCount = 0;
    let errorCount = 0;

    for (let i = 0; i < rows.length; i++) {
      const validatedRow = bulkIssuanceService.validateRow(
        rows[i], i + 1, pdfMap, existingStudentsMap, existingCertsSet, seenIds
      );
      validatedRows.push(validatedRow);
      if (validatedRow.status === 'valid') validCount++;
      else errorCount++;
    }

    const sessionId = `bulk_${crypto.randomBytes(8).toString('hex')}`;
    bulkSessionCache.set(sessionId, { rows: validatedRows, pdfMap });

    res.json({
      success: true,
      summary: { total: rows.length, valid: validCount, errors: errorCount },
      rows: validatedRows,
      confirmedRows: validatedRows.filter(r => r.status === 'valid').map(r => r.rowIndex),
      sessionId,
    });

  } catch (error) {
    console.error('Bulk Preview Error:', error);
    res.status(500).json({ error: 'Failed to process preview.' });
  }
};

// POST /api/certificates/bulk/issue
// Immediately responds with a jobId and processes in the background.
exports.bulkIssue = async (req, res) => {
  try {
    const { sessionId, confirmedRows } = req.body;

    if (!sessionId || !Array.isArray(confirmedRows))
      return res.status(400).json({ error: 'sessionId and confirmedRows are required.' });

    const sessionData = bulkSessionCache.get(sessionId);
    if (!sessionData)
      return res.status(404).json({ error: 'Session expired or not found. Please re-upload files.' });

    const { rows, pdfMap } = sessionData;
    const universityId = req.universityScope;
    const universityName = req.user.profile?.universityName || universityId.toString();
    const issuedByUserId = req.user._id;

    const rowsToProcess = rows.filter(r => confirmedRows.includes(r.rowIndex) && r.status === 'valid');
    if (rowsToProcess.length === 0)
      return res.status(400).json({ error: 'No valid rows selected for processing.' });

    // Remove session immediately so it can't be replayed
    bulkSessionCache.remove(sessionId);

    // Create a job entry and respond immediately
    const jobId = `job_${crypto.randomBytes(8).toString('hex')}`;
    bulkJobCache.create(jobId, rowsToProcess.length);

    res.status(202).json({
      success: true,
      message: 'Bulk issuance started. Poll the job status endpoint for progress.',
      jobId,
      total: rowsToProcess.length,
      statusUrl: `/api/certificates/bulk/job/${jobId}`,
    });

    // --- Background processing (does not block the response) --- 
    (async () => {
      try {
        for (const row of rowsToProcess) {
          const pdfBuffer = pdfMap.get(`${row.studentId}.pdf`.toLowerCase());
          const result = await bulkIssuanceService.processRow(row, pdfBuffer, universityId, issuedByUserId, universityName);
          bulkJobCache.pushResult(jobId, result);
          console.log(`[BulkJob ${jobId}] Processed ${bulkJobCache.get(jobId)?.processed}/${rowsToProcess.length} — student ${row.personalId}: ${result.status}`);
        }
        bulkJobCache.update(jobId, { status: 'done' });
        console.log(`[BulkJob ${jobId}] Completed.`);
      } catch (err) {
        bulkJobCache.update(jobId, { status: 'failed', error: err.message });
        console.error(`[BulkJob ${jobId}] Fatal error:`, err.message);
      }
    })();

  } catch (error) {
    console.error('Bulk Issue Error:', error);
    res.status(500).json({ error: 'Failed to start bulk issuance.' });
  }
};

// GET /api/certificates/bulk/job/:jobId
// Poll this endpoint to check issuance progress.
exports.bulkJobStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = bulkJobCache.get(jobId);

    if (!job)
      return res.status(404).json({ error: 'Job not found or expired.' });

    res.json({
      jobId,
      status: job.status,         // 'running' | 'done' | 'failed'
      total: job.total,
      processed: job.processed,
      succeeded: job.succeeded,
      failed: job.failed,
      results: job.results,       // array of per-row outcomes so far
    });
  } catch (error) {
    console.error('Bulk Job Status Error:', error);
    res.status(500).json({ error: 'Failed to get job status.' });
  }
};

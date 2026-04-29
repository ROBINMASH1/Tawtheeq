const crypto = require('crypto');
const User = require('../models/users.model');
const Certificate = require('../models/certificates.model');
const BulkJob = require('../models/bulkJob.model');
const bulkSessionCache = require('../services/bulkSessionCache');
const bulkIssuanceService = require('../services/bulkIssuance.service');
const bulkQueueProducer = require('../services/bulkQueue.producer');

/**
 * POST /api/certificates/bulk/preview
 * 
 * Validates CSV + ZIP uploads, checks students & duplicate certs,
 * and returns a preview of validated rows. No changes to this endpoint.
 */
exports.bulkPreview = async (req, res) => {
  try {
    const csvFile = req.files['csv'] ? req.files['csv'][0] : null;
    const zipFile = req.files['zip'] ? req.files['zip'][0] : null;

    if (!csvFile || !zipFile) {
      return res.status(400).json({ error: "Both CSV and ZIP files are required." });
    }

    const parsedCsv = bulkIssuanceService.parseCSV(csvFile.buffer);
    if (parsedCsv.error) {
      return res.status(400).json({ error: "Invalid CSV format: " + parsedCsv.error });
    }
    const rows = parsedCsv.rows;
    if (rows.length === 0) {
        return res.status(400).json({ error: "CSV contains no data rows" });
    }

    let pdfMap;
    try {
        pdfMap = bulkIssuanceService.extractZipEntries(zipFile.buffer);
    } catch (err) {
        return res.status(400).json({ error: "Failed to extract ZIP: " + err.message });
    }

    const personalIds = rows.map(r => r.personalId).filter(Boolean);
    
    const students = await User.find({ identifier: { $in: personalIds }, roleModel: 'Student' }, 'identifier');
    const existingStudentsMap = new Map(students.map(s => [s.identifier, s._id]));

    const studentObjectIds = students.map(s => s._id);
    const existingCerts = await Certificate.find({ 
        user: { $in: studentObjectIds },
        university: req.universityScope
    });
    
    const existingCertsSet = new Set(existingCerts.map(c => `${c.personalId}_${c.degree}`));

    const seenIds = new Set();
    const validatedRows = [];
    let validCount = 0;
    let errorCount = 0;

    for (let i = 0; i < rows.length; i++) {
        const validatedRow = bulkIssuanceService.validateRow(
            rows[i], 
            i + 1, 
            pdfMap, 
            existingStudentsMap, 
            existingCertsSet, 
            seenIds
        );
        validatedRows.push(validatedRow);
        if (validatedRow.status === 'valid') validCount++;
        else errorCount++;
    }

    const sessionId = `bulk_${crypto.randomBytes(8).toString('hex')}`;
    bulkSessionCache.set(sessionId, {
        rows: validatedRows,
        pdfMap: pdfMap
    });

    res.json({
        success: true,
        summary: { total: rows.length, valid: validCount, errors: errorCount },
        rows: validatedRows,
        sessionId
    });

  } catch (error) {
    console.error("Bulk Preview Error:", error);
    res.status(500).json({ error: "Failed to process preview" });
  }
};

/**
 * POST /api/certificates/bulk/issue
 * 
 * REFACTORED: Instead of processing rows synchronously in a serial for-loop,
 * this now dispatches the work to a BullMQ background job queue.
 * 
 * Returns immediately with a jobId that the frontend can use to poll for status.
 */
exports.bulkIssue = async (req, res) => {
  try {
    const { sessionId, confirmedRows } = req.body;
    
    if (!sessionId || !Array.isArray(confirmedRows)) {
      return res.status(400).json({ error: "sessionId and confirmedRows array are required" });
    }

    const sessionData = bulkSessionCache.get(sessionId);
    if (!sessionData) {
      return res.status(404).json({ error: "Session expired or not found. Please re-upload files." });
    }

    const { rows, pdfMap } = sessionData;
    const universityId = req.universityScope;
    const universityName = req.user.profile?.universityName || universityId.toString();
    const issuedByUserId = req.user._id;

    const rowsToProcess = rows.filter(r => confirmedRows.includes(r.rowIndex) && r.status === 'valid');

    if (rowsToProcess.length === 0) {
        return res.status(400).json({ error: "No valid rows selected for processing" });
    }

    // Dispatch to the background job queue instead of processing synchronously
    const { jobId } = await bulkQueueProducer.enqueueBulkIssuance({
      rows: rowsToProcess,
      pdfMap,
      universityId,
      universityName,
      issuedByUserId
    });

    // Clear the session cache immediately — data is now in the queue
    bulkSessionCache.remove(sessionId);

    res.status(202).json({
      success: true,
      message: 'Bulk issuance job has been queued for processing.',
      jobId,
      totalRows: rowsToProcess.length,
      statusUrl: `/api/certificates/bulk/status/${jobId}`
    });

  } catch (error) {
    console.error("Bulk Issue Error:", error);
    res.status(500).json({ error: "Failed to queue bulk issuance job" });
  }
};

/**
 * GET /api/certificates/bulk/status/:jobId
 * 
 * Polling endpoint for the frontend to check job progress.
 * Returns current status, progress counters, and per-row results.
 */
exports.bulkJobStatus = async (req, res) => {
  try {
    const { jobId } = req.params;

    const bulkJob = await BulkJob.findOne({ jobId });
    if (!bulkJob) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Ensure users can only view their own jobs (or jobs from their university)
    const isOwner = bulkJob.initiatedBy.toString() === req.user._id.toString();
    const isSameUniversity = bulkJob.university.toString() === req.universityScope?.toString();
    if (!isOwner && !isSameUniversity) {
      return res.status(403).json({ error: "Access denied" });
    }

    const progress = bulkJob.totalRows > 0
      ? Math.round((bulkJob.processedRows / bulkJob.totalRows) * 100)
      : 0;

    res.json({
      success: true,
      job: {
        jobId: bulkJob.jobId,
        status: bulkJob.status,
        totalRows: bulkJob.totalRows,
        processedRows: bulkJob.processedRows,
        succeededRows: bulkJob.succeededRows,
        failedRows: bulkJob.failedRows,
        progress,
        results: bulkJob.results,
        startedAt: bulkJob.startedAt,
        completedAt: bulkJob.completedAt,
        errorMessage: bulkJob.errorMessage,
        createdAt: bulkJob.createdAt
      }
    });

  } catch (error) {
    console.error("Bulk Job Status Error:", error);
    res.status(500).json({ error: "Failed to retrieve job status" });
  }
};

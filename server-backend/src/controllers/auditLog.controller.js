const AuditLog = require('../models/auditLogs.model');

exports.getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, actionType } = req.query;
    
    const query = {};
    if (actionType) query.actionType = actionType;

    const logs = await AuditLog.find(query)
      .populate('performedBy', 'email roleModel')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await AuditLog.countDocuments(query);

    res.json({
      data: logs,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch audit logs" });
  }
};

exports.exportAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('performedBy', 'email roleModel')
      .sort({ createdAt: -1 });
      
    res.json(logs); // Returning JSON. The frontend can easily map this to CSV if required
  } catch (error) {
    res.status(500).json({ error: "Failed to export audit logs" });
  }
};

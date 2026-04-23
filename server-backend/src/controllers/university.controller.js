const bcrypt = require("bcrypt");
const University = require("../models/universities.model");
const User = require("../models/users.model");
const UniUser = require("../models/uniUsers.model");
const AuditLog = require("../models/auditLogs.model");
const Certificate = require("../models/certificates.model");
const { generateTempPassword, generateOrgId, } = require("../utils/university.helpers");

const createUniversity = async (req, res) => {
  const created = { university: null, uniUser: null, adminUser: null, auditLog: null, };

  try {
    const { name, licenseNumber, address, contactEmail, Initialism } = req.body;

    if (!name || !licenseNumber || !contactEmail || !Initialism) {
      return res.status(400).json({
        success: false,
        message:
          "All required fields (name, licenseNumber, contactEmail, Initialism) must be provided.",
      });
    }

    const requesterUser = await User.findOne({ _id: req.user._id }).lean();

    if (!requesterUser) {
      return res.status(404).json({
        success: false,
        message: "Requester not found.",
      });
    }
    if (requesterUser.roleModel !== "MoheAdmin") {
      return res.status(403).json({
        success: false,
        message: "Requester is not a Mohe Admin.",
      });
    }

    const existingLicense = await University.exists({ licenseNumber });
    if (existingLicense) {
      return res
        .status(400)
        .json({ success: false, message: "University already registered." });
    }

    const existingEmail = await University.exists({ contactEmail });
    if (existingEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use." });
    }

    // Auto-generate orgId
    const orgId = await generateOrgId();

    const university = new University({
      orgId,
      name,
      licenseNumber,
      address,
      contactEmail,
    });
    await university.save();
    created.university = university;

    // Auto-generate Primar University Admin credentials
    let identifier = `${Initialism}_ADMIN`;
    const existingUserWithIdentifier = await User.exists({ identifier });

    if (existingUserWithIdentifier) {
      identifier = `${Initialism}_ADMIN_${orgId}`;
    }

    const tempPassword = generateTempPassword(12);
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    const uniUserDoc = new UniUser({
      role: "Uniadmin",
      createdBy: req.user._id,
      university: university._id,
    });
    await uniUserDoc.save();
    created.uniUser = uniUserDoc;

    const newAdminUser = new User({
      identifier,
      name: identifier,
      passwordHash,
      roleModel: "uniUser",
      profile: uniUserDoc._id,
    });
    await newAdminUser.save();
    created.adminUser = newAdminUser;

    const [auditLog] = await AuditLog.create([
      {
        actionType: "CREATE_UNIVERSITY",
        performedBy: req.user._id,
        targetId: university._id,
        details: JSON.stringify({ orgId, name, identifier }),
        ipAddress: req.ip || req.connection?.remoteAddress,
      },
    ]);
    created.auditLog = auditLog;

    return res.status(201).json({
      success: true,
      message: "University created successfully.",
      data: {
        university,
        adminCredentials: {
          identifier,
          tempPassword,
        },
      },
    });
  } catch (error) {
    try {
      if (created.auditLog)
        await AuditLog.findByIdAndDelete(created.auditLog._id);
      if (created.adminUser)
        await User.findByIdAndDelete(created.adminUser._id);
      if (created.uniUser) await UniUser.findByIdAndDelete(created.uniUser._id);
      if (created.university)
        await University.findByIdAndDelete(created.university._id);
    } catch (rollbackError) {
      console.error("Rollback failed:", rollbackError);
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

const getAllUniversities = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const universities = await University.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Attach admin User
    const universitiesWithAdmins = await Promise.all(
      universities.map(async (uni) => {
        const uniAdminProfile = await UniUser.findOne({
          university: uni._id,
          role: "Uniadmin",
        }).lean();
        let adminUser = null;
        if (uniAdminProfile) {
          adminUser = await User.findOne({ profile: uniAdminProfile._id })
            .select("-passwordHash")
            .lean();
        }
        return {
          ...uni,
          adminUser,
        };
      }),
    );

    return res.status(200).json({
      success: true,
      message: "Universities fetched successfully.",
      data: universitiesWithAdmins,
    });
  } catch (error) {
    console.error("Get universities error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

const getUniversityById = async (req, res) => {
  try {
    const { id } = req.params;

    const university = await University.findById(id).lean();
    if (!university) {
      return res
        .status(404)
        .json({ success: false, message: "University not found." });
    }

    if (req.user.roleModel === "uniUser") {
      if (!req.user.profile || req.user.profile.university.toString() !== id) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You do not have access to this university.",
        });
      }
    }

    const uniAdminProfile = await UniUser.findOne({
      university: id,
      role: "Uniadmin",
    }).lean();
    let adminUser = null;
    if (uniAdminProfile) {
      adminUser = await User.findOne({ profile: uniAdminProfile._id })
        .select("-passwordHash")
        .lean();
    }

    return res.status(200).json({
      success: true,
      message: "University fetched successfully.",
      data: {
        ...university,
        adminUser,
      },
    });
  } catch (error) {
    console.error("Get university by ID error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

const updateUniversity = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, contactEmail, orgId, licenseNumber } = req.body;

    if (orgId || licenseNumber) {
      return res.status(400).json({
        success: false,
        message: "orgId and licenseNumber cannot be changed.",
      });
    }

    const university = await University.findById(id);
    if (!university) {
      return res
        .status(404)
        .json({ success: false, message: "University not found." });
    }

    if (contactEmail && contactEmail !== university.contactEmail) {
      const emailExists = await University.exists({ contactEmail });
      if (emailExists) {
        return res
          .status(400)
          .json({ success: false, message: "Email already in use." });
      }
    }

    if (name) university.name = name;
    if (address) university.address = address;
    if (contactEmail) university.contactEmail = contactEmail;

    await university.save();

    await AuditLog.create({
      actionType: "UPDATE_UNIVERSITY",
      performedBy: req.user._id,
      targetId: university._id,
      details: JSON.stringify({ updatedFields: req.body }),
      ipAddress: req.ip || req.connection?.remoteAddress,
    });

    return res.status(200).json({
      success: true,
      message: "University updated successfully.",
      data: university,
    });
  } catch (error) {
    console.error("Update university error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

// MoheAdmin deletes a University (requires password confirmation via middleware)
const deleteUniversity = async (req, res) => {
  try {
    const { id } = req.params;

    const university = await University.findById(id);
    if (!university) {
      return res
        .status(404)
        .json({ success: false, message: "University not found." });
    }

    const deletedDetails = {
      orgId: university.orgId,
      name: university.name,
      licenseNumber: university.licenseNumber,
    };

    // Find all UniUser profiles for this university
    const uniUsers = await UniUser.find({ university: id }).lean();
    const uniUserIds = uniUsers.map(u => u._id);

    // Perform cascade delete
    // 1. Delete associated Users
    if (uniUserIds.length > 0) {
      await User.deleteMany({ profile: { $in: uniUserIds } });
    }

    // 2. Delete UniUser profiles
    await UniUser.deleteMany({ university: id });

    // 3. Delete Certificates linked to this university
    await Certificate.deleteMany({ university: id });

    // 4. Delete the University
    await University.findByIdAndDelete(id);

    await AuditLog.create({
      actionType: "DELETE_UNIVERSITY",
      performedBy: req.user._id,
      targetId: id,
      details: JSON.stringify(deletedDetails),
      ipAddress: req.ip || req.connection?.remoteAddress,
    });

    return res.status(200).json({
      success: true,
      message: "University and all associated data deleted successfully.",
    });
  } catch (error) {
    console.error("Delete university error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};


module.exports = { createUniversity, getAllUniversities, getUniversityById, updateUniversity, deleteUniversity, };

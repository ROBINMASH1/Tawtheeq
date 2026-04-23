const bcrypt = require("bcrypt");
const User = require("../models/users.model");
const UniUser = require("../models/uniUsers.model");
const AuditLog = require("../models/auditLogs.model");
const { generateTempPassword } = require("../utils/university.helpers");

// Uniadmin creates a UniStaff account for their university
const createUniStaff = async (req, res) => {

  const created = { uniStaffProfile: null, staffUser: null, auditLog: null };

  try {
    const { staffName, staffIdentifier } = req.body;

    if (!staffName || !staffIdentifier) {
      return res.status(400).json({
        success: false,
        message: "staffName and staffIdentifier are required.",
      });
    }

    //caller must be a Uniadmin
    const callerProfile = req.user.profile;
    if (!callerProfile || callerProfile.role !== "Uniadmin") {
      return res.status(403).json({
        success: false,
        message: "Only a Uniadmin can create UniStaff accounts.",
      });
    }

    const universityId = callerProfile.university;

    // 3. Duplicate identifier check
    const existingUser = await User.exists({ identifier: staffIdentifier });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user with this identifier already exists.",
      });
    }


    const tempPassword = generateTempPassword(12);
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    const uniStaffProfile = new UniUser({
      role: "UniStaff",
      createdBy: req.user._id,
      university: universityId,
    });
    await uniStaffProfile.save();
    created.uniStaffProfile = uniStaffProfile;

    const newStaffUser = new User({
      identifier: staffIdentifier,
      name: staffName,
      passwordHash,
      roleModel: "uniUser",
      profile: uniStaffProfile._id,
    });
    await newStaffUser.save();
    created.staffUser = newStaffUser;

    const [auditLog] = await AuditLog.create([
      {
        actionType: "CREATE_UNISTAFF",
        performedBy: req.user._id,
        targetId: newStaffUser._id,
        details: JSON.stringify({
          staffIdentifier,
          staffName,
          universityId: universityId.toString(),
          tempPassword,
        }),
        ipAddress: req.ip || req.connection?.remoteAddress,
      },
    ]);
    created.auditLog = auditLog;

    return res.status(201).json({
      success: true,
      message: "UniStaff account created successfully.",
      data: {
        staffCredentials: {
          identifier: staffIdentifier,
          tempPassword,
        },
      },
    });
  } catch (error) {

    // Manual rollback: delete created documents in reverse order
    console.error("Create UniStaff error:", error);
    try {
      if (created.auditLog)
        await AuditLog.findByIdAndDelete(created.auditLog._id);
      if (created.staffUser)
        await User.findByIdAndDelete(created.staffUser._id);
      if (created.uniStaffProfile)
        await UniUser.findByIdAndDelete(created.uniStaffProfile._id);
    } catch (rollbackError) {
      console.error("Rollback failed:", rollbackError);
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

// getAllUniStaff - UniAdmin views all UniStaff in their university
const getAllUniStaff = async (req, res) => {
  try {
    const callerProfile = req.user.profile;
    if (!callerProfile || callerProfile.role !== "Uniadmin") {
      return res.status(403).json({
        success: false,
        message: "Only a Uniadmin can view UniStaff accounts.",
      });
    }

    const universityId = callerProfile.university;

    // Find all UniStaff profiles for this university
    const staffProfiles = await UniUser.find({
      university: universityId,
      role: "UniStaff",
    }).lean();

    const profileIds = staffProfiles.map((p) => p._id);

    // Find matching User documents
    const staffUsers = await User.find({ profile: { $in: profileIds } })
      .select("-passwordHash")
      .lean();

    // Merge user info with profile info
    const result = staffUsers.map((user) => {
      const profile = staffProfiles.find(
        (p) => p._id.toString() === user.profile.toString(),
      );
      return {
        _id: user._id,
        identifier: user.identifier,
        name: user.name,
        isLocked: user.isLocked,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        createdBy: profile?.createdBy || null,
      };
    });

    return res.status(200).json({
      success: true,
      message: "UniStaff accounts fetched successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Get all UniStaff error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

// resetUniStaffPassword - UniAdmin resets a UniStaff's password (same university only)
const resetUniStaffPassword = async (req, res) => {
  try {
    const { userId } = req.params;

    //caller must be a Uniadmin
    const callerProfile = req.user.profile;
    if (!callerProfile || callerProfile.role !== "Uniadmin") {
      return res.status(403).json({
        success: false,
        message: "Only a Uniadmin can reset UniStaff passwords.",
      });
    }

    // Find the target user
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Verify the target is a uniUser
    if (targetUser.roleModel !== "uniUser") {
      return res.status(400).json({
        success: false,
        message: "Target user is not a university user.",
      });
    }

    const targetProfile = await UniUser.findById(targetUser.profile).lean();
    if (!targetProfile || targetProfile.role !== "UniStaff") {
      return res
        .status(400)
        .json({ success: false, message: "Target user is not a UniStaff." });
    }

    // Ensure same university
    if (
      targetProfile.university.toString() !==
      callerProfile.university.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can only reset passwords for staff in your own university.",
      });
    }

    const tempPassword = generateTempPassword(12);
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    targetUser.passwordHash = passwordHash;
    targetUser.isLocked = false;
    targetUser.failedLoginAttempts = 0;
    targetUser.lockedUntil = undefined;
    await targetUser.save();

    await AuditLog.create({
      actionType: "RESET_UNISTAFF_PASSWORD",
      performedBy: req.user._id,
      targetId: targetUser._id,
      details: JSON.stringify({
        identifier: targetUser.identifier,
        tempPassword,
      }),
      ipAddress: req.ip || req.connection?.remoteAddress,
    });

    return res.status(200).json({
      success: true,
      message: "UniStaff password reset successfully.",
      data: {
        identifier: targetUser.identifier,
        tempPassword,
      },
    });
  } catch (error) {
    console.error("Reset UniStaff password error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

// getAllUniAdmins — MoheAdmin views all UniAdmin accounts
const getAllUniAdmins = async (req, res) => {
  try {

    // Find all uniUser profiles with role "Uniadmin"
    const uniAdminProfiles = await UniUser.find({ role: "Uniadmin" })
      .populate("university", "name orgId licenseNumber contactEmail")
      .lean();

    const profileIds = uniAdminProfiles.map((p) => p._id);

    // Find matching User documents
    const adminUsers = await User.find({ profile: { $in: profileIds } })
      .select("-passwordHash")
      .lean();

    // Merge user info with profile/university info
    const result = adminUsers.map((user) => {
      const profile = uniAdminProfiles.find(
        (p) => p._id.toString() === user.profile.toString(),
      );
      return {
        _id: user._id,
        identifier: user.identifier,
        name: user.name,
        isLocked: user.isLocked,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        university: profile?.university || null,
      };
    });

    return res.status(200).json({
      success: true,
      message: "UniAdmin accounts fetched successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Get all UniAdmins error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

const resetUniAdminPassword = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the target user
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Verify the target is a UniAdmin
    if (targetUser.roleModel !== "uniUser") {
      return res.status(400).json({
        success: false,
        message: "Target user is not a university user.",
      });
    }

    const profile = await UniUser.findById(targetUser.profile).lean();
    if (!profile || profile.role !== "Uniadmin") {
      return res
        .status(400)
        .json({ success: false, message: "Target user is not a UniAdmin." });
    }

    // Generate new temp password
    const tempPassword = generateTempPassword(12);
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    targetUser.passwordHash = passwordHash;
    targetUser.isLocked = false;
    targetUser.failedLoginAttempts = 0;
    targetUser.lockedUntil = undefined;
    await targetUser.save();

    // Audit log
    await AuditLog.create({
      actionType: "RESET_UNIADMIN_PASSWORD",
      performedBy: req.user._id,
      targetId: targetUser._id,
      details: JSON.stringify({
        identifier: targetUser.identifier,
        tempPassword,
      }),
      ipAddress: req.ip || req.connection?.remoteAddress,
    });

    return res.status(200).json({
      success: true,
      message: "UniAdmin password reset successfully.",
      data: {
        identifier: targetUser.identifier,
        tempPassword,
      },
    });
  } catch (error) {
    console.error("Reset UniAdmin password error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};
// deleteUniStaff - UniAdmin deletes a UniStaff (requires password confirmation via middleware)
const deleteUniStaff = async (req, res) => {
  try {
    const { userId } = req.params;

    //caller must be a Uniadmin
    const callerProfile = req.user.profile;
    if (!callerProfile || callerProfile.role !== "Uniadmin") {
      return res.status(403).json({
        success: false,
        message: "Only a Uniadmin can delete UniStaff accounts.",
      });
    }

    // Find the target user
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Verify the target is a uniUser
    if (targetUser.roleModel !== "uniUser") {
      return res.status(400).json({
        success: false,
        message: "Target user is not a university user.",
      });
    }

    const targetProfile = await UniUser.findById(targetUser.profile).lean();
    if (!targetProfile || targetProfile.role !== "UniStaff") {
      return res
        .status(400)
        .json({ success: false, message: "Target user is not a UniStaff." });
    }

    //Ensure same university
    if (
      targetProfile.university.toString() !==
      callerProfile.university.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only delete staff in your own university.",
      });
    }

    const deletedDetails = {
      identifier: targetUser.identifier,
      name: targetUser.name,
      uniUserId: targetProfile._id.toString(),
    };

    // Perform cascade delete
    await User.findByIdAndDelete(targetUser._id);
    await UniUser.findByIdAndDelete(targetProfile._id);

    await AuditLog.create({
      actionType: "DELETE_UNISTAFF",
      performedBy: req.user._id,
      targetId: targetUser._id,
      details: JSON.stringify(deletedDetails),
      ipAddress: req.ip || req.connection?.remoteAddress,
    });

    return res.status(200).json({
      success: true,
      message: "UniStaff account deleted successfully.",
    });
  } catch (error) {
    console.error("Delete UniStaff error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

module.exports = { createUniStaff, getAllUniAdmins, resetUniAdminPassword, getAllUniStaff, resetUniStaffPassword, deleteUniStaff, };

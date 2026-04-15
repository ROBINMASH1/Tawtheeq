require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { connectDB } = require("../config/db");

const User = require("../models/users.model");
const UniUser = require("../models/uniUsers.model");
const MoheAdmin = require("../models/moheAdmins.model");
const University = require("../models/universities.model");
const Student = require("../models/students.model");

const SALT_ROUNDS = 12;

// ── Seed Data ────────────────────────────────────────────────────────────────

const universityData = {
  orgId: "UNI-001",
  name: "King Abdullah University",
  licenseNumber: "LIC-2024-0001",
  address: "Riyadh, Saudi Arabia",
  contactEmail: "contact@kau.edu.sa",
};

const adminData = {
  identifier: "admin001",
  name: "System Admin",
  password: "Admin@1234",
  role: "Uniadmin",
};

const moheAdminData = {
  identifier: "mohe001",
  name: "MOHE Super Admin",
  password: "Mohe@1234",
};

const studentData = {
  identifier: "2200112233",
  name: "Ali Abdullah",
  password: "Student@1234",
  phone: "+966500000000",
  email: "ali.abdullah@student.edu.sa",
  isActive: true,
};

// ── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");

    // ── Clear existing seed data (idempotent) ──────────────────────────────
    await University.deleteOne({ orgId: universityData.orgId });

    const oldAdmin = await User.findOne({ identifier: adminData.identifier });
    if (oldAdmin) {
      await UniUser.deleteOne({ _id: oldAdmin.profile });
      await User.deleteOne({ _id: oldAdmin._id });
    }

    const oldMohe = await User.findOne({ identifier: moheAdminData.identifier });
    if (oldMohe) {
      await MoheAdmin.deleteOne({ _id: oldMohe.profile });
      await User.deleteOne({ _id: oldMohe._id });
    }

    const oldStudent = await User.findOne({ identifier: studentData.identifier });
    if (oldStudent) {
      await Student.deleteOne({ _id: oldStudent.profile });
      await User.deleteOne({ _id: oldStudent._id });
    }
    console.log("🧹 Cleared old seed data");

    // ── Create University ──────────────────────────────────────────────────
    const university = await University.create(universityData);
    console.log(
      `🏛️  University created: ${university.name} (${university._id})`,
    );

    // ── Create UniUser profile ─────────────────────────────────────────────
    const uniUserProfile = await UniUser.create({
      role: adminData.role,
      university: university._id,
    });
    console.log(`👤 UniUser profile created (${uniUserProfile._id})`);

    // ── Create User account ────────────────────────────────────────────────
    const passwordHash = await bcrypt.hash(adminData.password, SALT_ROUNDS);
    const user = await User.create({
      identifier: adminData.identifier,
      name: adminData.name,
      passwordHash,
      roleModel: "uniUser",
      profile: uniUserProfile._id,
    });
    console.log(`✅ User account created: ${user.identifier} (${user._id})`);

    // ── Create MOHEAdmin profile ───────────────────────────────────────────
    const moheProfile = await MoheAdmin.create({});
    console.log(`👤 MOHEAdmin profile created (${moheProfile._id})`);

    // ── Create MOHEAdmin User account ──────────────────────────────────────
    const mohePasswordHash = await bcrypt.hash(
      moheAdminData.password,
      SALT_ROUNDS,
    );
    const moheUser = await User.create({
      identifier: moheAdminData.identifier,
      name: moheAdminData.name,
      passwordHash: mohePasswordHash,
      roleModel: "MoheAdmin",
      profile: moheProfile._id,
    });
    console.log(
      `✅ MOHEAdmin account created: ${moheUser.identifier} (${moheUser._id})`,
    );

    // ── Create Student profile ─────────────────────────────────────────────
    const studentProfile = await Student.create({
      phone: studentData.phone,
      email: studentData.email,
      isActive: studentData.isActive,
    });
    console.log(`👤 Student profile created (${studentProfile._id})`);

    // ── Create Student User account ────────────────────────────────────────
    const studentPasswordHash = await bcrypt.hash(
      studentData.password,
      SALT_ROUNDS,
    );
    const studentUser = await User.create({
      identifier: studentData.identifier,
      name: studentData.name,
      passwordHash: studentPasswordHash,
      roleModel: "Student",
      profile: studentProfile._id,
    });
    console.log(
      `✅ Student account created: ${studentUser.identifier} (${studentUser._id})`,
    );

    // ── Summary ────────────────────────────────────────────────────────────
    console.log("\n─────────────────────────────────────────");
    console.log("🌱 Seed complete! Login credentials:");
    console.log(
      `   UniAdmin    → ${adminData.identifier} / ${adminData.password}`,
    );
    console.log(
      `   MOHEAdmin   → ${moheAdminData.identifier} / ${moheAdminData.password}`,
    );
    console.log(
      `   Student     → ${studentData.identifier} / ${studentData.password}`,
    );
    console.log("─────────────────────────────────────────\n");
  } catch (err) {
    console.error("❌ Seeding failed:", err.message || err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

seed();

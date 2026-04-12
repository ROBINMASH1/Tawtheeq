require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { connectDB } = require("./config/db");

const User = require("../models/users.model");
const UniUser = require("../models/uniUsers.model");
const MoheAdmin = require("../models/moheAdmins.model");
const University = require("../models/universities.model");

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

// ── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");

    // ── Clear existing seed data (idempotent) ──────────────────────────────
    await University.deleteOne({ orgId: universityData.orgId });
    await User.deleteOne({ identifier: adminData.identifier });
    await User.deleteOne({ identifier: moheAdminData.identifier });
    // Profile docs are referenced by User.profile — cascade delete via User deletions above
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
      isFirstLogin: false, // Admin doesn't need activation
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
      roleModel: "MOHEAdmin",
      profile: moheProfile._id,
      isFirstLogin: false,
    });
    console.log(
      `✅ MOHEAdmin account created: ${moheUser.identifier} (${moheUser._id})`,
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

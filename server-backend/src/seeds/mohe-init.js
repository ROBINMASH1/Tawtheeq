const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { connectDB } = require("../config/db");

const User = require("../models/users.model");
const MoheAdmin = require("../models/moheAdmins.model");

const SALT_ROUNDS = 12;

// ── MOHE Admin accounts to seed ───────────────────────────────────────────────

const MOHE_ADMINS = [
  {
    identifier: "mohe_admin1",
    name: "MOHE Primary Admin",
    password: "Mohe@Admin1234",
    EmployeeID: "EMP-MOHE-001",
  },
  {
    identifier: "mohe_admin2",
    name: "MOHE Secondary Admin",
    password: "Mohe@Admin4321",
    EmployeeID: "EMP-MOHE-002",
  },
];

// ── Ensure all collections exist ──────────────────────────────────────────────

async function ensureCollections() {
  const db = mongoose.connection.db;
  const existing = await db.listCollections().toArray();
  const existingNames = existing.map((c) => c.name);

  const collections = [
    "users",
    "uniusers",
    "moheadmins",
    "universities",
    "students",
    "certificates",
    "auditlogs",
    "otps",
  ];

  for (const name of collections) {
    if (!existingNames.includes(name)) {
      await db.createCollection(name);
      console.log(`  📦 Created collection: ${name}`);
    } else {
      console.log(`  ✅ Collection exists:  ${name}`);
    }
  }
}

// ── Seed MOHE admins ──────────────────────────────────────────────────────────

async function seedMoheAdmins() {
  for (const admin of MOHE_ADMINS) {
    const exists = await User.findOne({ identifier: admin.identifier });
    if (exists) {
      console.log(`  ⏭️  Already exists: ${admin.identifier} — skipped`);
      continue;
    }

    const employeeExists = await MoheAdmin.findOne({
      EmployeeID: admin.EmployeeID,
    });
    if (employeeExists) {
      console.log(
        `  ⏭️  EmployeeID ${admin.EmployeeID} already in use — skipped`
      );
      continue;
    }

    const moheProfile = await MoheAdmin.create({
      EmployeeID: admin.EmployeeID,
    });

    await User.create({
      identifier: admin.identifier,
      name: admin.name,
      passwordHash: await bcrypt.hash(admin.password, SALT_ROUNDS),
      roleModel: "MoheAdmin",
      profile: moheProfile._id,
    });

    console.log(`  ✅ Created: ${admin.identifier}  /  ${admin.password}`);
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function run() {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB\n");

    console.log("── Ensuring collections ─────────────────────────────────");
    await ensureCollections();

    console.log("\n── Seeding MOHE admins ──────────────────────────────────");
    await seedMoheAdmins();

    console.log("\n─────────────────────────────────────────────────────────");
    console.log("🌱 Done.");
    console.log("─────────────────────────────────────────────────────────\n");
  } catch (err) {
    console.error("❌ Seed failed:", err.message || err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

run();

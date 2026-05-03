require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { connectDB } = require("../config/db");

const User = require("../models/users.model");
const UniUser = require("../models/uniUsers.model");
const MoheAdmin = require("../models/moheAdmins.model");
const University = require("../models/universities.model");
const Student = require("../models/students.model");
const Certificate = require("../models/certificates.model");

const SALT_ROUNDS = 12;

async function seed() {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");

    // Clear existing data for a fresh start
    await Promise.all([
      User.deleteMany({}),
      UniUser.deleteMany({}),
      MoheAdmin.deleteMany({}),
      University.deleteMany({}),
      Student.deleteMany({}),
      Certificate.deleteMany({}),
    ]);
    console.log("🧹 Database cleared");

    // 1. Create MOHE Admin
    const moheProfile = await MoheAdmin.create({ EmployeeID: "MOHE-001" });
    await User.create({
      identifier: "mohe_admin",
      name: "MOHE Admin",
      passwordHash: await bcrypt.hash("Mohe@123", SALT_ROUNDS),
      roleModel: "MoheAdmin",
      profile: moheProfile._id,
    });
    console.log("👤 MOHE Admin created");

    // 2. Create University
    const university = await University.create({
      orgId: "UNI-01",
      name: "Demo University",
      licenseNumber: "LIC-001",
      address: "Riyadh",
      contactEmail: "demo@uni.edu.sa",
    });
    console.log("🏛️  University created");

    // 3. Create University Admin
    const adminProfile = await UniUser.create({
      role: "Uniadmin",
      university: university._id,
    });
    const uniAdmin = await User.create({
      identifier: "uni_admin",
      name: "University Admin",
      passwordHash: await bcrypt.hash("Uni@123", SALT_ROUNDS),
      roleModel: "uniUser",
      profile: adminProfile._id,
    });
    console.log("👤 University Admin created");

    // 4. Create Student
    const studentProfile = await Student.create({
      phone: "+966500000000",
      email: "student@demo.com",
      isActive: true,
    });
    const studentUser = await User.create({
      identifier: "2200112233",
      name: "Ali Student",
      passwordHash: await bcrypt.hash("Student@123", SALT_ROUNDS),
      roleModel: "Student",
      profile: studentProfile._id,
    });
    console.log("👤 Student created");

    // 5. Create Certificate
    await Certificate.create({
      certificateId: "CERT-2025-001",
      user: studentUser._id,
      university: university._id,
      studentId: "S123",
      personalId: "2200112233",
      ipfsHash: "QmDemoHash123",
      blockchainTxHash: "0xDemoTxHash",
      status: "verified",
      degree: "Bachelor",
      major: "Computer Science",
      gpa: 4.5,
      graduationDate: new Date(),
      issuedBy: uniAdmin._id,
    });
    console.log("📜 Certificate created");

    console.log("\n🚀 Simple Seed Complete!");
  } catch (err) {
    console.error("❌ Seed failed:", err);
  } finally {
    await mongoose.disconnect();
  }
}

seed();

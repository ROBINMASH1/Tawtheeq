const mongoose = require("mongoose");

async function connectDB() {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connect to DB successfully");
}

module.exports = { connectDB };
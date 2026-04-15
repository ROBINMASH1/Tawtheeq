const express = require("express");
const { connectDB } = require("./config/db");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to the Tawtheeq API");
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/students", require("./routes/students"));
//app.use("/api/universities", require("./routes/university.routes"));

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
}

startServer();

const express = require("express");
const { connectDB } = require("./config/db");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./config/swagger.json");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/students", require("./routes/students"));
app.use("/api/universities", require("./routes/university.routes"));
app.use("/api/uniUsers", require("./routes/uniUsers.routes"));
app.use("/api/certificates", require("./routes/certificates.routes"));
app.use("/api/verify", require("./routes/verify.routes"));
app.use("/api/audit-logs", require("./routes/auditLogs.routes"));

const distPath = path.join(__dirname, "../../client-frontend/dist");
app.use(express.static(distPath));

// For any other route, serve the index.html (SPA support)
app.use((req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
}

startServer();

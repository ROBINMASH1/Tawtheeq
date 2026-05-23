const express = require("express");
const { connectDB } = require("./config/db");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./config/swagger.json");
const basicAuth = require("express-basic-auth");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

//security middlewares
app.use(helmet());

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/api-docs",
  basicAuth({
    users: { [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD },
    challenge: true,
  }),
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/students", require("./routes/students.routes"));
app.use("/api/universities", require("./routes/university.routes"));
app.use("/api/uniUsers", require("./routes/uniUsers.routes"));
app.use("/api/certificates", require("./routes/certificates.routes"));
app.use("/api/verify", require("./routes/verify.routes"));
app.use("/api/audit-logs", require("./routes/auditLogs.routes"));

const distPath = path.join(__dirname, "../../client-frontend/dist");
app.use(express.static(distPath));

// Handler for any other route
app.use((req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

//Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: "Something went wrong" });
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

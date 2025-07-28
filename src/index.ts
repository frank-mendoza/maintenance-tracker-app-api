import express from "express";

import cors from "cors";
import mongoose from "mongoose";
import * as dotenv from "dotenv";

import cookieParser from "cookie-parser";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import path from "path";
import morgan from "morgan";
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware";

import rateLimiter from "express-rate-limit";

import { v2 as cloudinary } from "cloudinary";

import authRouter from "./routes/authRouter";
import userRouter from "./routes/userRouter";
import propertyRouter from "./routes/propertyRouter";
import maintenanceRouter from "./routes/maintenanceRouter";
import { authenticateUser } from "./middleware/authMiddleware";

dotenv.config();

const app = express();

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { msg: "IP rate limit exceeded, retry in 15 minutes." },
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.use(
  cors({
    origin: process.env.WEB_APP_ROUTE, // Explicitly set the allowed origin
    credentials: true, // Allow cookies and authentication headers
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Specify allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow necessary headers
  })
);

app.use(express.json());

app.use(cookieParser());

app.use(helmet());
app.use(mongoSanitize());

// __dirname workaround for ES modules
export const __dirname = path.resolve();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Define the directory where PDFs will be saved
// const REPORTS_DIR = path.join(__dirname, "uploads", "reports");

// Ensure the folder exists
// if (!existsSync(REPORTS_DIR)) {
//   mkdirSync(REPORTS_DIR, { recursive: true });
// }

// app.get("/", (req, res) => {
//   res.send("✅ Backend running with Node.js 20 and Express 4.19");
// });

app.use("/api/v1/auth", apiLimiter, authRouter);
app.use("/api/v1/property", apiLimiter, authenticateUser, propertyRouter);
app.use("/api/v1/user", apiLimiter, authenticateUser, userRouter);
app.use("/api/v1/maintenance", apiLimiter, authenticateUser, maintenanceRouter);

app.use((req, res) => {
  res.status(404).json({ msg: "Not found", error: true });
});

// Handle OPTIONS preflight requests
app.options("*", cors());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:"],
      // Add other necessary directives...
    },
  })
);

// Error handler middleware should be the last middleware
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🌐 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });

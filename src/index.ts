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

import { v2 as cloudinary } from "cloudinary";

import authRouter from "./routes/authRouter";
import userRouter from "./routes/userRouter";
import propertyRouter from "./routes/propertyRouter";
import maintenanceRouter from "./routes/maintenanceRouter";
import { authenticateUser } from "./middleware/authMiddleware";
import http from "http";
import { initSocket } from "./utils/socketHandlers/socket";

import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

dotenv.config();

const app = express();

app.set("trust proxy", 1);

// const apiLimiter = rateLimiter({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100,
//   message: { msg: "IP rate limit exceeded, retry in 15 minutes." },
// });

const server = http.createServer(app);

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

// Initialize socket.io
initSocket(server);

// Swagger
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Maintenance Tracker API",
      version: "1.0.0",
      description: "API documentation for maintenance tracker project",
    },
    servers: [
      {
        url: process.env.API_BASE_URL,
      },
    ],
  },
  apis: ["./src/lib/*.ts"], // Path to your TypeScript route files
};

const swaggerSpec = swaggerJSDoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/property", authenticateUser, propertyRouter);
app.use("/api/v1/user", authenticateUser, userRouter);
app.use("/api/v1/maintenance", authenticateUser, maintenanceRouter);

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
      console.log(`🌐 Server is now active...`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });

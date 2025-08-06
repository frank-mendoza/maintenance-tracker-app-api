"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.__dirname = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv = __importStar(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const errorHandlerMiddleware_1 = __importDefault(require("./middleware/errorHandlerMiddleware"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cloudinary_1 = require("cloudinary");
const authRouter_1 = __importDefault(require("./routes/authRouter"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const propertyRouter_1 = __importDefault(require("./routes/propertyRouter"));
const maintenanceRouter_1 = __importDefault(require("./routes/maintenanceRouter"));
const authMiddleware_1 = require("./middleware/authMiddleware");
dotenv.config();
const app = (0, express_1.default)();
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: { msg: "IP rate limit exceeded, retry in 15 minutes." },
});
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});
app.use((0, cors_1.default)({
    origin: process.env.WEB_APP_ROUTE, // Explicitly set the allowed origin
    credentials: true, // Allow cookies and authentication headers
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Specify allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow necessary headers
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)());
app.use((0, express_mongo_sanitize_1.default)());
// __dirname workaround for ES modules
exports.__dirname = path_1.default.resolve();
if (process.env.NODE_ENV === "development") {
    app.use((0, morgan_1.default)("dev"));
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
app.use("/api/v1/auth", apiLimiter, authRouter_1.default);
app.use("/api/v1/property", apiLimiter, authMiddleware_1.authenticateUser, propertyRouter_1.default);
app.use("/api/v1/user", apiLimiter, authMiddleware_1.authenticateUser, userRouter_1.default);
app.use("/api/v1/maintenance", apiLimiter, authMiddleware_1.authenticateUser, maintenanceRouter_1.default);
app.use((req, res) => {
    res.status(404).json({ msg: "Not found", error: true });
});
// Handle OPTIONS preflight requests
app.options("*", (0, cors_1.default)());
app.use(helmet_1.default.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "blob:"],
        // Add other necessary directives...
    },
}));
// Error handler middleware should be the last middleware
app.use(errorHandlerMiddleware_1.default);
const PORT = process.env.PORT || 5000;
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => {
    app.listen(PORT, () => {
        console.log(`🌐 Server running at http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
});

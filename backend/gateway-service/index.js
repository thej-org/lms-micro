import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import { authenticate } from "./middlewares/auth.js";
import proxy from 'express-http-proxy';

config();

const apiGateway = express();
apiGateway.use(cookieParser());
apiGateway.use(cors({
    origin: '*', 
    credentials: true,
}));

// Proxy routes for various services
apiGateway.use('/gateway/api/auth', proxy(process.env.AUTH_API));
apiGateway.use('/gateway/api/payment', proxy(process.env.PAYMENT_API));
apiGateway.use('/gateway/api/course', proxy(process.env.COURSE_API));
apiGateway.use('/gateway/api/learner', proxy(process.env.LEARNER_API));

// Apply authentication middleware
apiGateway.use('/gateway/api/*', authenticate);

// Middleware to add userId to request headers before proxying
apiGateway.use('/gateway/api/*', (req, res, next) => {
    req.headers.userId = req.userId;  // Ensure authenticate sets req.userId
    next();
});

// Not found route
apiGateway.use((req, res) => {
    return res.status(404).json({ message: "Endpoint not found" });
});

// Start the server
apiGateway.listen(process.env.API_GATEWAY_PORT, () => {
    console.log(`API Gateway running on ${process.env.API_GATEWAY_PORT}`);
});

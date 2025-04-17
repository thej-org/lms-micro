import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import httpProxy from "http-proxy";
import { authenticate } from "./middlewares/auth.js";


config();

const apiGateway = express();
apiGateway.use(cookieParser());
apiGateway.use(cors({
    origin: '*', 
    credentials: true,
}));
const proxy = httpProxy.createProxyServer({});

const colors = {
    reset: "\x1b[0m",
    cyan: "\x1b[36m",
    yellow: "\x1b[33m",
    magenta: "\x1b[35m",
    green: "\x1b[32m"
};

// Function to log requests with color
const consoleLog = (message, color) => {
    console.log(`${color}${message}${colors.reset}`);
};

apiGateway.get('/gateway', (req, res) => {
    return res.status(200).json({ message: "gateway online" });
})

console.log("Auth API:", process.env.AUTH_API);

apiGateway.use('/gateway/api/auth', (req, res) => {
    consoleLog(`Request sent to auth server from gateway`, colors.green);
    proxy.web(req, res, { target: process.env.AUTH_API });
});

apiGateway.use('/gateway/api/*', authenticate);

// Middleware to add userId to request headers before proxying
apiGateway.use('/gateway/api/*', (req, res, next) => {
    req.headers.userId = req.userId;
    next();
});

proxy.on('error', (error, req, res) => {
    console.error('Proxy Error:', error);
    res.status(500).send('Proxy Error');
});

apiGateway.listen(process.env.API_GATEWAY_PORT, () => {
    console.log(`API Gateway running on ${process.env.API_GATEWAY_PORT}`);
});

apiGateway.use('/gateway/api/payment', (req, res) => {
console.log('req :', req.userId);
    consoleLog(`Request sent to payment server from gateway`, colors.cyan);
    proxy.web(req, res, { target: process.env.PAYMENT_API });
});

apiGateway.use('/gateway/api/course', (req, res) => {
    consoleLog(`Request sent to course server from gateway`, colors.yellow);
    proxy.web(req, res, { target: process.env.COURSE_API });
});

apiGateway.use('/gateway/api/learner', (req, res) => {
    consoleLog(`Request sent to learner server from gateway`, colors.magenta);
    proxy.web(req, res, { target: process.env.LEARNER_API });
}); 

//not found route
apiGateway.use((req, res) => {
    return res.status(404).json({ message: "endpoint not found" });
})

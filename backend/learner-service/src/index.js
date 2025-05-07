import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import { connectDB } from "../configs/DBConnect.js";
import { router } from "../src/routes/learnerRoutes.js";

config();
export const learnerService = express();

learnerService.use(cookieParser());
learnerService.use(
  cors({
    origin: '*', 
    credentials: true,
  })
);

learnerService.use(express.json());

const port = process.env.LEARNER_PORT;

learnerService.use("/", router);

// Start the server after connecting to the db
connectDB()
  .then(() => {
    learnerService.listen(port, () => {
      console.log(`Learner server running on ${process.env.LEARNER_API}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });

// learnerService.get("/", (req, res) => {
//   console.log(`Received request to learner server from gateway`);
//   res.status(200).send("Response from learner server");
// });

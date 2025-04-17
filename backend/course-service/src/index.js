import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import { connectDB } from "../configs/DBConnect.js";
import { router } from "../src/routes/course.js";

config();

export const courseService = express();

courseService.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

courseService.use(express.json());

const port = process.env.COURSE_PORT;

courseService.use("/", router);

// Start the server after connecting to the database
connectDB()
  .then(() => {
    courseService.listen(port, () => {
      console.log(`Course server running on ${process.env.COURSE_API}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });

// courseService.post("/", (req, res) => {
//   console.log(`Received request to course server from gateway`);
//   res.status(200).send("Response from course server");
// });

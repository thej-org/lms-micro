import { config } from "dotenv";
import express from "express";
import { connectDB } from "../configs/DBConnect.js";
import { getUserById, login, register } from "./controllers/auth.controller.js";

config();
export const authService = express();
authService.use(express.json());
const port = process.env.AUTH_PORT;

// Start the server after connecting to the db
connectDB()
  .then(() => {
    authService.listen(port, () => {
      console.log(`Auth server running on ${process.env.AUTH_API}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });

authService.post("/test", (req, res) => {
  console.log(`Received request to auth server from gateway`);
  res.status(200).send("Response from auth server");
});

authService.post("/login", login);
authService.post("/register", register);
authService.get("/user/:userId", getUserById);

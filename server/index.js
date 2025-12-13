const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = 5000;

app.use(cors()); // Allow Next.js to talk to us
app.use(express.json());

// CONNECT TO MONGO
// "mongo_db" will be the name of the container in docker-compose
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://mongo_db:27017/devops_app";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

app.get("/api/status", (req, res) => {
  res.json({
    message: "Backend is RUNNING",
    timestamp: new Date(),
    v: "version 2",
  });
});

app.get("/api/home", (req, res) => {
  res.json({ message: "Hello from the Backend Container!" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

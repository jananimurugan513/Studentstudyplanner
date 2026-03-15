require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoute = require("./routes/auth");
const subjectRoute = require("./routes/subjects");
const taskRoute = require("./routes/tasks");
const examRoute = require("./routes/exams");

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/studyplanner", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful!"))
  .catch((err) => {
    console.log(err);
  });

app.use("/api/auth", authRoute);
app.use("/api/subjects", subjectRoute);
app.use("/api/tasks", taskRoute);
app.use("/api/exams", examRoute);

app.get("/", (req, res) => {
  res.send("Study Planner API is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});

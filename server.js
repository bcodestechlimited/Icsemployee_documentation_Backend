require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
// const cookieParser = require('cookie-parser');
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const PORT = process.env.PORT || 3550;
const multer = require("multer");

// Connect to MongoDB
connectDB();

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors());

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

//serve static files
app.use("/", express.static(path.join(__dirname, "/public")));

// routes
app.use("/", require("./routes/root"));

// Auth
app.use("/auth", require("./routes/auth/user"));
app.use("/user", require("./routes/user/user"));
app.use("/user/personalInfo", require("./routes/employee/personalDetails"));
app.use("/user/employeeDetails", require("./routes/employee/employeeDetails"));
app.use(
  "/user/educationalBackground",
  require("./routes/employee/educationBackground")
);
app.use("/user/certificate", require("./routes/employee/certificates"));
app.use("/user/guarantors", require("./routes/employee/guarantors"));
app.use("/user/signature", require("./routes/employee/signature"));
app.use("/admin", require("./routes/admin/admin"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

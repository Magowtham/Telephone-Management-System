require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 5000;
//mongodb connection
connectDB();
//middlewares
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5500",
  })
);
app.use(cookieParser());
//main routes
app.use("/telephone", require("./Routes/telephone"));
app.use("/admin", require("./Routes/admin"));

//starting server
app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});

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
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "https://test-client-5qkx.onrender.com",
    credentials: true,
  })
);
//main routes
app.post("/root", require("./controllers/Admin/admin_register"));
app.post("/login", require("./controllers/Admin/admin_login"));
app.use("/telephone", require("./Routes/telephone"));
app.use("/admin", require("./cookie_authoriser"), require("./Routes/admin"));

//starting server
app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});

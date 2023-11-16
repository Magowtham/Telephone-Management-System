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
 app.use(function (req, res, next) {
   res.header("Access-Control-Allow-Origin", req.headers.origin);
   res.header(
     "Access-Control-Allow-Headers",
     "Origin, X-Requested-With, Content-Type, Accept"
   );
   next();
 }); 
app.use(cookieParser());
app.use(express.json());
  app.use(
    cors({
      origin: ["https://admin.vsensetechnologies.com", "http://localhost:3000"],
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

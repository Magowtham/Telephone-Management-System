require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
//mongodb connection
connectDB();
//middlewares
const allowedOrgins = ["https://admin.vsensetechnologies.com","http://localhost:3000"];
const corsOptions = {
  origin: function (origin, callBack) {
    if (allowedOrgins.indexOf(origin) !== -1 || !origin) {
      callBack(null, true);
    } else {
      callBack(new Error("access denied"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.use(express.json());

//main routes
app.get("/auto_login",require("./auto_login"))
app.post("/root", require("./controllers/Admin/admin_register"));
app.post("/login", require("./controllers/Admin/admin_login"));
app.use("/telephone", require("./Routes/telephone"));
app.use("/admin", require("./token_authenticater"),require("./Routes/admin"));
// const recharge=require("./models/expense_model");
// recharge.deleteMany({}).then(()=>{
//   console.log("deleted");
// })
//starting server
app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});
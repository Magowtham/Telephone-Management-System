require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
//mongodb connection
connectDB();
//middlewares
const allowedOrgins = [
  "https://admin.vsensetechnologies.com",
  "http://localhost:3000",
];
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
app.get("/auto_login", require("./auto_login"));
app.post("/root", require("./controllers/Admin/admin_register"));
app.post("/login", require("./controllers/Admin/admin_login"));
app.use("/telephone", require("./Routes/telephone"));
app.use("/admin", require("./token_authenticater"), require("./Routes/admin"));
// const recharge=require("./models/expense_model");
// recharge.deleteMany({}).then(()=>{
//   console.log("deleted");
// })
//starting server

// const UserModel = require("./models/add_user_model");

// UserModel.deleteMany({}).then(() => {
//   console.log("deleted");
// });

// const fs = require("fs");
const UserModel = require("./models/add_user_model");

// fs.readFile(
//   "/home/edwin/Telephone-Management-System-Server/controllers/Admin/index.json",
//   "utf-8",
//   (err, data) => {
//     if (err) {
//       console.log(err);
//       return;
//     }

//     try {
//       const jsonData = JSON.parse(data);

//       jsonData.users.forEach(async (element, index) => {
//         await UserModel({
//           rfid: element.rfid,
//           card_id: element.name,
//           hostel_id: "65ec5f51355608484776a1f6",
//           name: "test",
//           roll_number: index + 1,
//           balance: 100,
//         }).save();
//         console.log("success", index);
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   }
// );

// UserModel({
//   rfid: "1",
//   card_id: "1",
//   hostel_id: "65ec6c855f67995d1f76280e",
//   name: "test",
//   roll_number: 1,
//   balance: 100,
// }).save();

// const RechargeModel = require("./models/recharge_model");
// const { time } = require("./controllers/Others/current_date")();

// (async () => {
//   const res = await UserModel.find({});
//   res.forEach(async (ele, index) => {
//     const history = new RechargeModel({
//       user_id: ele._id.toString(),
//       hostel_id: ele.hostel_id,
//       date: new Date(),
//       time: time,
//       amount: 100,
//     });

//     await history.save();

//   });
// })();

app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});

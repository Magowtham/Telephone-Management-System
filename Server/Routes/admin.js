const routes = require("express").Router();

routes.post("/add_user", require("../controller/Admin/add_user"));
routes.get("/get_users", require("../controller/Admin/get_users"));
routes.post("/login", require("../controller/Admin/admin_login"));
routes.post("/register", require("../controller/Admin/admin_register"));
routes.post("/forgot_password", require("../controller/Admin/forgot_password"));
routes.post("/delete_user", require("../controller/Admin/delete_user"));
routes.put("/edit_user/:id", require("../controller/Admin/edit_user"));
routes.get(
  "/recharge_history",
  require("../controller/Admin/get_recharge_history")
);
routes.get(
  "/expense_history",
  require("../controller/Admin/get_expense_history")
);
routes.get("/search_user", require("../controller/Admin/search_user"));
routes.get(
  "/download_recharge_history",
  require("../controller/Admin/download_recharge_history")
);
module.exports = routes;

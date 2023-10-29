const routes = require("express").Router();

routes.post("/recharge", require("../controller/Telephone/recharge"));
routes.post("/start_call", require("../controller/Telephone/start_call"));
routes.post("/end_call", require("../controller/Telephone/end_call"));

module.exports = routes;

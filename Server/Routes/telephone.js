const routes = require("express").Router();

routes.get("/recharge", require("../controllers/Telephone/recharge"));
routes.get("/start_call", require("../controllers/Telephone/start_call"));
routes.get("/end_call", require("../controllers/Telephone/end_call"));

module.exports = routes;

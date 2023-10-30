const routes = require("express").Router();

routes.post("/recharge", require("../controllers/Telephone/recharge"));
routes.post("/start_call", require("../controllers/Telephone/start_call"));
routes.post("/end_call", require("../controllers/Telephone/end_call"));

module.exports = routes;

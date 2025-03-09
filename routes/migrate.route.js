//import the express module
const express = require("express");

//call the router method from the express to create router
const router = express.Router();

//import the install controller
const installController = require("../controllers/install.controller.js");

//create a route to handle the install request on get
router.get("/install", installController.install);

//export the router
module.exports = router;

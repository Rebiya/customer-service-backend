//import express module and call the router method to create a router
const express = require("express");
const router = express.Router();

//import migrate route
const migrateRouter = require("./migrate.route.js");
//use the router to handle requests
router.use(migrateRouter);
//import the login router
// const loginRouter = require("./login.routes.js");
//use the router to handle requests
// router.use(loginRouter);
//export the router
module.exports = router;

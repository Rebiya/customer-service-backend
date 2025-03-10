//import express module and call the router method to create a router
const express = require("express");
const router = express.Router();

//import migrate route
const migrateRouter = require("./migrate.route.js");
//use the router to handle requests
router.use(migrateRouter);
// import the login router
const loginRouter = require("./Auth/login.route.js");
//use the router to handle requests
router.use(loginRouter);
//import the user router
const userRouter = require("./user.route.js");
//use the router to handle requests
router.use(userRouter);
//export the router
module.exports = router;

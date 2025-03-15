const express = require("express");
const router = express.Router();
const migrateRouter = require("./migrate.route.js");
const loginRouter = require("./Auth/login.route.js");
const signupRouter = require("./Auth/signup.route.js");
const userRouter = require("./user.route.js");
const logoutRouter = require("./Auth/logout.route.js");

//use the imported routers
router.use(logoutRouter);
router.use(migrateRouter);
router.use(signupRouter);
router.use(loginRouter);
router.use(userRouter);

module.exports = router;

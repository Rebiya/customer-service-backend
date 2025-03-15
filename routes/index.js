const express = require("express");
const router = express.Router();
const migrateRouter = require("./migrate.route.js");
const loginRouter = require("./Auth/login.route.js");
const signupRouter = require("./Auth/signup.route.js");
const userRouter = require("./user.route.js");
const logoutRouter = require("./Auth/logout.route.js");
const ForgotPassRouter = require("../routes/Auth/ForgotPass.route.js");

// Use the imported routers with correct paths
router.use(ForgotPassRouter);
router.use(logoutRouter);
router.use(migrateRouter);
router.use(signupRouter);
router.use(loginRouter);
router.use(userRouter);

module.exports = router;

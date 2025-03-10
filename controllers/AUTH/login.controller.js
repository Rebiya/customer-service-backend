//import the login service
const loginService = require("../../services/AUTH/login.service.js");
//import the jwt module
const jwt = require("jsonwebtoken");
//import the jwt secrete key from the environment variable
const jwtSecret = process.env.JWT_KEY;

//function to login the user
const login = async (req, res) => {
  try {
    const userData = req.body;
    // console.log(userData);

    //call the login service to authenticate the user
    const user = await loginService.login(userData);

    //if user is not found
    if (user.status === "fail") {
      return res
        .status(403)
        .json({ message: user.message, status: user.status });
    }

    //if successful ,send a response to the client
    const payload = {
      employee_id: user.data.employee_id,
      employee_first_name: user.data.employee_first_name,
      employee_last_name: user.data.employee_last_name,
      employee_email: user.data.employee_email,
      employee_phone: user.data.employee_phone,
      employee_role: user.data.company_role_id,
    };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: "18h" });

    // console.log(token);

    const sendBack = {
      employee_token: token,
    };

    return res
      .status(200)
      .json({ token: token, status: user.status, message: "login successful" });
  } catch (error) {
    //if any error occurs send the error response
    return res
      .status(500)
      .json({ message: "something went wrong on logging in" });
  }
};

//export the login function
module.exports = { login };

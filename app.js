//import the express module
const express = require("express");
// import the env module and call the config method
require("dotenv").config();
//import the query function from the db.config file
const query = require("./Config/db.config");
//import the sanitize module
const sanitize = require("sanitize");
//import the cors
const cors = require("cors");
//setup the CORS options to allow requests from our frontend
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200,
};
// import routes as a middleware
const router = require("./routes");
// create an express application
const app = express();
// setup the cors middleware
app.use(cors(corsOptions));
// Add the express.json middleware to the application
app.use(express.json());
// Add the sanitizer to the express middleware
app.use(sanitize.middleware);
//use router in the application
app.use("/api", router);
//set the port
const port = process.env.PORT;
//start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
//export the server for use in application
module.exports = app;

// Importing the required modules from the 'aircode' and 'jsonwebtoken' packages
// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const jwt = require('jsonwebtoken');

// Loading environment variables from a .env file
require('dotenv').config;

// Exporting an asynchronous function as a module
module.exports.verifyToken = async function (context) {
  // Initializing variables for token and authorization header
  let token;
  let authHeader = context.headers.Authorization || context.headers.authorization;
  console.log(authHeader);

  // Checking if the authorization header is present and starts with 'Bearer'
  if (authHeader && authHeader.startsWith('Bearer')) {
    // Extracting the token from the authorization header
    token = authHeader.split(" ")[1];
    console.log(token);

    try {
      // Verifying the JWT token using the secret key from environment variables
      const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log("The logged in user info: ", user);
      return user;
    } catch (err) {
      // Handling token verification errors
      return null;
    }
  }

  // Returning null if no valid token is found
  if (!token) {
    return null;
  }
};

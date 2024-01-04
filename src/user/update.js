// Importing the aircode library and the verifyToken function
// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const { verifyToken } = require('../helper/verifyToken'); 

// Exporting an asynchronous function that takes params and context as parameters
module.exports = async function (params, context) {
  // Verifying the token using the verifyToken function
  const tokenUser = await verifyToken(context);
  console.log(tokenUser);

  // Checking if the token is valid
  if (tokenUser != null) {
    const { _id } = tokenUser;
    const { name } = params;

    // Accessing the 'user' table from the aircode database
    const userTable = aircode.db.table('user');

    // Finding the user with the specified _id
    const user = await userTable
      .where({ _id })
      .projection({isAdmin: 0, password: 0, accessToken: 0})
      .findOne();

    // Updating the 'name' property of the user object
    user.name = name;
    
    try {
      // Saving the updated user object back to the user table
      await userTable.save(user);
      context.status(200);
    
      // Returning the updated user information
      return {
        ...user
      };
    } catch (err) {
      // Handling errors and setting the HTTP status code to 500
      context.status(500);
    
      // Returning an error message if the update fails
      return {
        'message': err.message
      };
    }

  } else {
    // Handling the case where the token is invalid or the user is not authorized
    context.status(401);

    // Returning an unauthorized message
    return {
      'message': 'Token invalid or user is not authorized'
    };
  }
};

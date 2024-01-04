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

    // Accessing the 'user' table from the aircode database
    const userTable = aircode.db.table('user');

    // Finding the user with the specified _id
    const user = await userTable
      .where({ _id })
      .findOne();

    try {
      // Deleting the user from the user table
      const result = await userTable.delete(user);
      context.status(204);

      // Returning the result of the deletion
      return {
        result
      };

    } catch (err) {
      // Handling errors and setting the HTTP status code to 500
      context.status(500);

      // Returning an error message
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

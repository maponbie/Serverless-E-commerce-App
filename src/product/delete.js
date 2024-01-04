// Importing the aircode library and the verifyToken function
// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const { verifyToken } = require('../helper/verifyToken'); 

// Exporting an asynchronous function that takes params and context as parameters
module.exports = async function (params, context) {
  // Verifying the token using the verifyToken function
  const tokenUser = await verifyToken(context);
  console.log(tokenUser);

  // Checking if the token is valid and isAdmin
  if (tokenUser != null && tokenUser.isAdmin) {
    const { _id } = params;

    // Accessing the 'product' table from the aircode database
    const productTable = aircode.db.table('product');

    // Finding the product with the specified _id
    const product = await productTable
      .where({ _id })
      .findOne();

    try {
      // Deleting the product from the product table
      const result = await productTable.delete(product);
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

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
  if (tokenUser != null && tokenUser.isAdmin) {

    const {_id, title, description, inStock, category, price, color, size} = params;

    // Accessing the 'product' table from the aircode database
    const productTable = aircode.db.table('product');

    // Finding the product with the specified _id
    const product = await productTable
      .where({_id})
      .findOne();
    
    try {
      // Saving the updated product object back to the product table
      const result = await productTable.save(params);
      context.status(200);
    
      // Returning the updated product information
      return {
        ...result
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
    // Handling the case where the token is invalid or the product is not authorized
    context.status(401);

    // Returning an unauthorized message
    return {
      'message': 'Token invalid or user is not authorized'
    };
  }
};

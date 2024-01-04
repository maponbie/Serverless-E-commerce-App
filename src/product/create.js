// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const { verifyToken } = require('../helper/verifyToken'); 

module.exports = async function (params, context) {
  const tokenUser = await verifyToken(context);
  if (tokenUser != null && tokenUser.isAdmin) {
    const {title, description, inStock, category, price, color, size} = params;

    if(!title || !category || !price) {
      context.status(400);
      return {
        'message': 'Title, category, and price are mandatory'
      }
    }
    const productTable = aircode.db.table('product');

    const productExist = await productTable
    
    .where({title})
    .findOne();

    if(productExist) {

      // If the product exists, set the HTTP status code to 400 (Bad Request)
      context.status(400);

      // Return a response indicating that the product already exists
      return {'message': 'Product already exist'}
    }

    try {
      const result = await productTable.save(params);

      // If successful, set the HTTP status code to 201 (Created)
      context.status(201);
      return {
        result
      }
      
    }catch(err) {

      // If an error occurs during the product saving process, set the HTTP status code to 500 (Internal Server Error)
      context.status(500);
      return {
        'message': err.message
      }
    }
    
  } else {
    context.status(401);
    return {"message": "Token invalid or user is not authorized"};
  }
};

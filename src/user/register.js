// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const bcrypt = require('bcrypt');

// The await keyword is used to handle asynchronous operations, and it is commonly used with promises to wait for them to resolve or reject before continuing with the execution of the code.

module.exports = async function (params, context) {
  console.log('Received params:', params);
  console.log('Received context:', context);

  const {name, email, password} = params;

// Check for Validation
  if(!name || !email || !password) {
    context.status(400);
    return {
      "message": "All fields are mandatory"
    }
  }

const userTable = aircode.db.table('user');

const userExist = await userTable
  .where({email})
  .findOne()

if (userExist){
  context.status(409);
  return {
    "message": "User already exists"
  }
}  

try {
  // Count the number of users in the userTable (REST endpoint)
  const count = await userTable
    .where()
    .count();

  // Log the user count to the console
  console.log("The user count is:", count);

  // Hash the password using bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user object with a hashed password and default isAdmin value
  const newUser = {
    name,
    email,
    "password": hashedPassword,
    "isAdmin": false
  };

  // If there are no existing users, set isAdmin to true for the first user
  if (count == 0) {
    newUser.isAdmin = true;
  }

  // Save the new user to the userTable
  await userTable.save(newUser);

  // Retrieve the user data (excluding password and isAdmin)
  const result = await userTable
    .where({ email })
    .projection({ password: 0, isAdmin: 0 })
    .find();

  console.log("the result is : ", result);
  // Respond with a 201 Created status and the user data
  context.status(201);

  return {
    result
  };

} catch (err) {
  // If an error occurs, respond with a 500 Internal Server Error and an error message
  context.status(500);
  return {
    "message": err.message
  };
}

  

};

// Require necessary module
const mongoose = require('mongoose') // Mongoose for MongoDB interaction

// Define the schema for User documents
const userSchema = new mongoose.Schema({
  name: {
    type: String, // Field for the name of the user
    required: true // It's required for each User document
  }
})

// Export the model, which represents User documents
module.exports = mongoose.model('user', userSchema)
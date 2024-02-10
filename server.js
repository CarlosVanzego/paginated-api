// Require necessary modules
const express = require('express') // Express.js for creating web server
const app = express() // Create an Express application
const mongoose = require('mongoose') // Mongoose for MongoDB interaction
const User = require('./users') // Import the User model

// Connect to MongoDB database
mongoose.connect('mongodb://localhost/pagination', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.once('open', async () => {
  if (await User.countDocuments().exec() > 0) return
  
  Promise.all([
  User.create({ name: 'User 1' }),
  User.create({ name: 'User 2' }),
  User.create({ name: 'User 3' }),
  User.create({ name: 'User 4' }),
  User.create({ name: 'User 5' }),
  User.create({ name: 'User 6' }),
  User.create({ name: 'User 7' }),
  User.create({ name: 'User 8' }),
  User.create({ name: 'User 9' }),
  User.create({ name: 'User 10' }),
  User.create({ name: 'User 11' }),
  User.create({ name: 'User 12' }),
  ]).then(() => console.log('Added Users'))
})

app.get('/users',paginatedResults(User), (req, res) => {
  res.json(res.paginatedResults)
})

// Middleware function to implement pagination logic
function paginatedResults(model) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page) // Extract page number from query parameter
    const limit = parseInt(req.query.limit) // Extract limit from query parameter
  
    const startIndex = (page - 1 ) * limit // Calculate start index for pagination
    const endIndex = page * limit // Calculate end index for pagination
  
    const results = {} // Object to store paginated results
      
    // Check if there are more pages after the current page
    if (endIndex < await model.countDocuments().exec()) {
      results.next = {
        page: page + 1, // Next page number
        limit: limit // Limit for next page
        }
      }
      // Check if there are previous pages before the current page
    if (startIndex > 0) {
      results.previous = {
        page: page - 1, // Previous page number
        limit: limit // Limit for previous page
    }
  }
  try {
      // Query database for paginated results
    results.results =  model.find().limit(limit).skip(startIndex).exec()
    res.paginatedResults = results // Attach paginated results to response object
    next() // Move to the next middleware or route handler
  } catch (e) {
    res.status(500).json({ message: e.message }) // Handle error if query fails
  }
  }
}

// Start the Express server, listen on port 3000
app.listen(3000)
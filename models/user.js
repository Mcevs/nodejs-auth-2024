const mongoose = require('mongoose')

const USerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    unique: true,
    maxLength: 30,
    minLength: 3,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    trim: true,
    unique: true,
    maxLength: 30,
    minLength: 6,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    trim: true,
    minlength: 6,
  },
  role: {
    type: String,
    trim: true,
    enum:["admin", "user"],
    default:"user"
  },
}, {timestamps: true})


module.exports = mongoose.model("User", USerSchema)
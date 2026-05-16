 
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  phone: {
    type: String,
    default: null,
  },
  address: {
    street: { type: String, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    country: { type: String, default: null },
  },
  authCode: {
    type: String,
    default: null,
  },
  authCodeExpires: {
    type: Date,
    default: null,
  },
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)
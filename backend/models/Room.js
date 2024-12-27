
// backend/models/Room.js

const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  available: {
    type: Boolean,
    default: true
  },
  superficie: {
    type: String,
    required: true
  }
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;

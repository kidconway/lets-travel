const mongoose = require('mongoose')

const hotelSchema = new mongoose.Schema({
  hotel_name: {
    type: String,
    required: true,
    max: 32,
    trim: true
  },
  hotel_description: {
    type: String,
    required: true,
    trim: true
  },
  image: String,
  star_rating: {
    type: Number,
    required: true,
    max: 5
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  cost_per_night: {
    type: Number,
    required: true
  },
  available: {
    type: Boolean,
    required: true
  }
})

hotelSchema.index({
  hotel_name: 'text',
  country: 'text'
})

module.exports = mongoose.model('Hotel', hotelSchema)

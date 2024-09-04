const mongoose = require('mongoose');

const decorationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  services: {
    type: [String],
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  availableDates: {
    type: [String],
    required: true,
  },
  logo: {
    type: String, // Path to the logo image
  },
  images: {
    type: [String], // Array of paths to uploaded images
  }
});

const Decoration = mongoose.model('Decoration', decorationSchema);

module.exports = Decoration;
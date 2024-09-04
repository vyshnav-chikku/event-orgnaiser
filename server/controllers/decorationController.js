const Decoration = require('../models/decorationModel');

// Add Decoration Team
const addDecorationTeam = async (req, res) => {
  const { name, services, location, availableDates } = req.body;


  console.log(req.files);
  

  try {
    const newDecoration = new Decoration({
      name,
      services: services.split(','), // Assuming services are sent as a comma-separated string
      location,
      availableDates: availableDates.split(','), // Assuming dates are sent as a comma-separated string
      logo: req.files['logo'] ? req.files['logo'][0].path : '', // Store the path of the logo image
      images: req.files['images'] ? req.files['images'].map(file => file.path) : [] // Store the paths of uploaded images
    });

    await newDecoration.save();
    res.json({ message: 'Decoration team added successfully' });
  } catch (err) {
    console.error('Error adding decoration team:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get All Decoration Teams
const getAllDecorations = async (req, res) => {
  try {

    console.log("getAllDecorations");
    
    const decorations = await Decoration.find();
    res.json(decorations);
  } catch (err) {
    console.error('Error fetching decorations:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { addDecorationTeam, getAllDecorations };

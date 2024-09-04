const express = require('express');
const router = express.Router();
const { addDecorationTeam, getAllDecorations } = require('../controllers/decorationController');
const upload = require('../middlewares/uploadMiddleware');

// Route to add a decoration team with image upload
router.post('/add', upload.fields([
  { name: 'logo', maxCount: 1 }, // Handle single logo upload
  { name: 'images', maxCount: 10 } // Handle multiple image uploads (max 10)
]), addDecorationTeam);

// Route to get all decoration teams
router.get('/', getAllDecorations);

module.exports = router;

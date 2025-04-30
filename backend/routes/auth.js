const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const multer = require('multer');
const path = require('path');

// Configuration de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../Docs/avatars')); // Assure-toi que le dossier existe
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, Date.now() + "." + ext);
  }
});

const upload = multer({ storage });

// Routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/me', authController.getProfile);
router.put('/me', upload.single('avatar'), authController.updateProfile);
router.get('/users', authController.getAllUsers);

module.exports = router;

const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// Sert les fichiers HTML/CSS/JS
app.use(express.static(path.join(__dirname, '..', 'Docs')));

// Sert les images de profil
app.use('/avatars', express.static(path.join(__dirname, '..', 'Docs', 'avatars')));

// API
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

app.listen(3000, () => console.log('Server running on http://localhost:3000/Pages/login.html'));

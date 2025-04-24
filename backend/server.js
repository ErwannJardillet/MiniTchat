const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../Docs')));

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));

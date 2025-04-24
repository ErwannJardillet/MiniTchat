const express = require('express');
const session = require('express-session');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors({
    origin: 'http://localhost:5500', // à adapter selon ton front
    credentials: true
}));

app.use(express.json());

app.use(session({
    secret: 'superSecretKey',
    resave: false,
    saveUninitialized: false
}));

app.use('/api/auth', authRoutes);

app.listen(3000, () => {
    console.log('Serveur backend sur http://localhost:3000');
});

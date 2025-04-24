const bcrypt = require('bcrypt');
const db = require('../models/db');

exports.register = (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(201).json({ message: 'Utilisateur créé' });
    });
};

exports.login = (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length === 0) return res.status(404).json({ error: 'Utilisateur non trouvé' });

        const user = results[0];
        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ error: 'Mot de passe incorrect' });
        }

        req.session.user = { id: user.id, username: user.username };
        res.json({ message: 'Connecté', user: req.session.user });
    });
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ error: err });
        res.clearCookie('connect.sid');
        res.json({ message: 'Déconnecté' });
    });
};

exports.getUser = (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user });
    } else {
        res.status(401).json({ error: 'Non connecté' });
    }
};

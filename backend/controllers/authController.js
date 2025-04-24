const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../model/db.js');

exports.signup = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
    if (rows.length > 0) {
      return res.status(400).json({ message: "Utilisateur déjà existant" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword]);

    res.status(201).json({ message: "Utilisateur créé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
    if (rows.length === 0) {
      return res.status(400).json({ message: "Identifiants invalides" });
    }

    const user = rows[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ message: "Identifiants invalides" });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, "ton_secret", { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

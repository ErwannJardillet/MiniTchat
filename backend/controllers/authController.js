const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../model/db.js");

exports.signup = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
    if (rows.length > 0) {
      return res.status(400).json({ message: "Utilisateur déjà existant" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (username, password, avatar) VALUES (?, ?, ?)",
      [username, hashedPassword, "avatars/avatar-placeholder.png"]
    );

    res.status(201).json({ message: "Utilisateur créé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur lors de l'inscription" });
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

    const token = jwt.sign({ id: user.id, username: user.username }, "ton_secret", {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur lors de la connexion" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "ton_secret");

    const [rows] = await db.query(
      "SELECT username, avatar, age, gender FROM users WHERE id = ?",
      [decoded.id]
    );

    const user = rows[0];
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Token invalide" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "ton_secret");

    const { username, age, gender } = req.body;
    const avatarFile = req.file;

    if (!username || username.trim() === "") {
      return res.status(400).json({ message: "Le nom d'utilisateur est obligatoire" });
    }

    let avatarPath = null;
    if (avatarFile) {
      avatarPath = "avatars/" + avatarFile.filename;
    }

    const updateFields = ["username = ?", "age = ?", "gender = ?"];
    const values = [username, age || null, gender || null];

    if (avatarPath) {
      updateFields.push("avatar = ?");
      values.push(avatarPath);
    }

    values.push(decoded.id);

    const sql = `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`;

    await db.query(sql, values);

    res.json({ message: "Profil mis à jour avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour du profil" });
  }
};

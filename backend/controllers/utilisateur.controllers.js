const { v4: uuidv4 } = require("uuid");
const { ACCESS_TOKEN_SECRET } = require("../config.js");
const jwt = require("jsonwebtoken");

function generateAccessToken(user) {
  return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: "1800s" });
}

const db = require("../models/index.js");
const Utilisateurs = db.utilisateurs;
const Produits = db.produits;

// Login utilisateur
exports.login = async (req, res) => {
  try {
    const { login, password } = req.body;

    // Validation des champs
    const pattern = /^[A-Za-z0-9]{1,20}$/;
    if (!pattern.test(login) || !pattern.test(password)) {
      return res.status(400).send({ message: "Login ou password incorrect" });
    }

    const utilisateur = await Utilisateurs.findOne({ where: { login } });
    if (!utilisateur) {
      return res.status(404).send({ message: `Utilisateur avec login=${login} non trouvé.` });
    }

    // Générer le token d'accès
    const user = {
      id: utilisateur.id,
      name: utilisateur.nom,
      email: utilisateur.email,
    };
    const accessToken = generateAccessToken(user);

    res.setHeader("Authorization", `Bearer ${accessToken}`);
    res.status(200).send({
      user: utilisateur,
      accessToken,
    });
  } catch (err) {
    res.status(500).send({ message: "Erreur lors du login", error: err.message });
  }
};

// Création d'un utilisateur
exports.createUser = async (req, res) => {
  const { nom, prenom, login, password } = req.body;

  if (!nom || !login || !password) {
    return res.status(400).send({ message: "Required fields are missing" });
  }

  try {
    const newUser = await Utilisateurs.create({
      id: uuidv4(),
      nom,
      prenom: prenom || null,
      login,
      pass: password,
    });
    res.status(201).send(newUser);
  } catch (err) {
    res.status(500).send({ message: "Erreur lors de la création de l'utilisateur", error: err.message });
  }
};

exports.addProductsToUser = async (req, res) => {
  const { userId } = req.params;
  const { produits } = req.body;

  if (!Array.isArray(produits)) {
    return res.status(400).json({ message: "Invalid produits format. Must be an array." });
  }

  try {
    const utilisateur = await Utilisateurs.findByPk(userId);
    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const updatedProduits = [];
    for (const produit of produits) {
      const existingProduit = await Produits.findOne({
        where: { utilisateurId: userId, titre: produit.titre },
      });

      if (existingProduit) {
        // Incrémenter la quantité si le produit existe déjà
        existingProduit.quantite += 1;
        await existingProduit.save();
        updatedProduits.push(existingProduit);
      } else {
        const newProduit = await Produits.create({ ...produit, utilisateurId: userId });
        updatedProduits.push(newProduit);
      }
    }

    res.status(200).json({
      message: "Produits ajoutés/incrémentés avec succès",
      produits: updatedProduits,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


exports.removeProductFromUser = async (req, res) => {
  const { userId, productId } = req.params; // Récupérer les paramètres d'URL

  try {
    const utilisateur = await Utilisateurs.findByPk(userId);
    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const produit = await Produits.findOne({
      where: { id: productId, utilisateurId: userId },
    });

    if (!produit) {
      return res.status(404).json({ message: "Produit non trouvé pour cet utilisateur" });
    }

    // Décrémenter la quantité ou supprimer complètement si la quantité atteint 0
    if (produit.quantite > 1) {
      produit.quantite -= 1;
      await produit.save();
      return res.status(200).json({
        message: "Quantité décrémentée avec succès",
        produit,
      });
    } else {
      await produit.destroy(); // Supprime le produit si la quantité est 0
      return res.status(200).json({ message: "Produit supprimé avec succès" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


// Récupérer les produits d'un utilisateur
exports.getUserProducts = async (req, res) => {
  const { userId } = req.params;

  try {
    const utilisateur = await Utilisateurs.findByPk(userId, {
      include: [{ model: Produits, as: "produits" }],
    });

    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json(utilisateur.produits || []);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

const { v4: uuidv4 } = require("uuid");
const { ACCESS_TOKEN_SECRET } = require("../config.js");
const jwt = require("jsonwebtoken");

const db = require("../models/index.js");
const Utilisateurs = db.utilisateurs;
const Produits = db.produits;
const ShoppingBag = db.shoppingBag;

// Fonction pour générer un jeton d'accès
function generateAccessToken(user) {
  return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: "1800s" });
}

// Vérification de l'existence d'un utilisateur
async function verifyUtilisateur(userId) {
  const utilisateur = await Utilisateurs.findByPk(userId);
  if (!utilisateur) {
    throw new Error("Utilisateur non trouvé");
  }
  return utilisateur;
}

// Vérification de l'existence d'un produit
async function verifyProduit(produitId) {
  console.log(produitId )
  const produit = await Produits.findByPk(produitId);
  if (!produit) {
    throw new Error("Produit non trouvé");
  }
  return produit;
}

// Login utilisateur
exports.login = async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).send({ message: "Login ou mot de passe incorrect" });
    }

    const utilisateur = await Utilisateurs.findOne({ where: { login } });
    if (!utilisateur) {
      return res.status(404).send({ message: "Utilisateur non trouvé" });
    }

    const user = {
      id: utilisateur.id,
      name: utilisateur.nom,
      login: utilisateur.login,
    };

    const accessToken = generateAccessToken(user);
    res.setHeader("Authorization", `Bearer ${accessToken}`);
    res.status(200).send({ user, accessToken });
  } catch (err) {
    res.status(500).send({ message: "Erreur lors du login", error: err.message });
  }
};

// Création d'un utilisateur
exports.createUser = async (req, res) => {
  const { nom, prenom, login, password } = req.body;

  if (!nom || !login || !password) {
    return res.status(400).send({ message: "Les champs requis sont manquants" });
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

// Ajouter un produit au panier de l'utilisateur
exports.addProductToUser = async (req, res) => {
  const { userId } = req.params;
  const { produitId, quantite} = req.body;
  console.log(req.body)
  console.log(produitId)
  try {
    await verifyUtilisateur(userId);
    await verifyProduit(produitId);

    const [relation, created] = await ShoppingBag.findOrCreate({
      where: { utilisateurId: userId, produitId },
      defaults: { quantite: quantite || 1 },
    });

    if (!created) {
      relation.quantite += quantite || 1;
      await relation.save();
    }

    res.status(200).json({ message: "Produit ajouté avec succès", relation });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Supprimer un produit du panier d'un utilisateur
exports.removeProductFromUser = async (req, res) => {
  const { userId, productId } = req.params;

  try {
    await verifyUtilisateur(userId);

    const relation = await ShoppingBag.findOne({
      where: { utilisateurId: userId, produitId: productId },
    });

    if (!relation) {
      return res.status(404).json({ message: "Produit non trouvé dans le panier" });
    }

    if (relation.quantite > 1) {
      relation.quantite -= 1;
      await relation.save();
      return res.status(200).json({ message: "Quantité décrémentée avec succès" });
    } else {
      await relation.destroy();
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
    const produits = await ShoppingBag.findAll({
      where: { utilisateurId: userId },
      include: [
        {
          model: Produits,
          as: "produit", // Utilisez l'alias correct défini dans l'association
          attributes: ["id", "titre", "categorie", "prix"],
        },
      ],
    });

    const produitsAvecQuantite = produits.map((relation) => ({
      id: relation.produit.id,
      titre: relation.produit.titre,
      categorie: relation.produit.categorie,
      prix: relation.produit.prix,
      quantite: relation.quantite,
    }));
    res.status(200).json(produitsAvecQuantite);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  const { nom, prenom, login, password } = req.body;

  try {
    const utilisateur = await Utilisateurs.findByPk(userId);
    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    utilisateur.nom = nom || utilisateur.nom;
    utilisateur.prenom = prenom || utilisateur.prenom;
    utilisateur.login = login || utilisateur.login;
    utilisateur.pass = password || utilisateur.pass;

    await utilisateur.save();

    res.status(200).json({ message: "Utilisateur mis à jour avec succès", utilisateur });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur :", error.message);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { userId } = req.params;
  console.log(userId)
  try {
    const utilisateur = await Utilisateurs.findByPk(userId);
    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Supprime les relations dans la table pivot si nécessaire
    await db.shoppingBag.destroy({ where: { utilisateurId: userId } });

    // Supprime l'utilisateur
    await utilisateur.destroy();

    res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur :", error.message);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

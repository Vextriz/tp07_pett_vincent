const db = require("../models/index.js");
const Produits = db.produits;
// Endpoint pour insérer directement une liste de produits
exports.insertCatalogue = async (req, res) => {
  const catalogue = [
    { id: '1', titre: 'Produit 1', prix: 100, categorie: 'Catégorie A' },
    { id: '2', titre: 'Produit 2', prix: 200, categorie: 'Catégorie B' },
    { id: '3', titre: 'Produit 3', prix: 300, categorie: 'Catégorie C' },
    { id: '4', titre: 'Produit 4', prix: 400, categorie: 'Catégorie D' },
    { id: '5', titre: 'Produit 5', prix: 500, categorie: 'Catégorie A' },
    { id: '6', titre: 'Produit 6', prix: 600, categorie: 'Catégorie B' },
    { id: '7', titre: 'Produit 7', prix: 700, categorie: 'Catégorie C' },
    { id: '8', titre: 'Produit 8', prix: 800, categorie: 'Catégorie D' },
    { id: '9', titre: 'Produit 9', prix: 900, categorie: 'Catégorie A' },
    { id: '10', titre: 'Produit 10', prix: 1000, categorie: 'Catégorie E' },
  ];

  try {
    const createdProducts = await Produits.bulkCreate(catalogue, { ignoreDuplicates: true });
    res.status(201).json({
      message: 'Catalogue inséré avec succès',
      produits: createdProducts,
    });
  } catch (error) {
    console.error('Erreur lors de l’insertion du catalogue :', error.message);
    res.status(500).json({
      message: 'Erreur serveur lors de l’insertion du catalogue',
      error: error.message,
    });
  }
};

// Endpoint pour récupérer le catalogue avec filtres
exports.get = async (req, res) => {
  console.log("Requête reçue avec filtres :", req.query);
  try {
    const { titre, categorie, minPrix, maxPrix } = req.query;
    const whereClause = {};

    // Ajout des filtres
    if (titre) whereClause.titre = { [db.Sequelize.Op.iLike]: `%${titre}%` };
    if (categorie) whereClause.categorie = categorie;
    if (minPrix) whereClause.prix = { ...(whereClause.prix || {}), [db.Sequelize.Op.gte]: parseFloat(minPrix) };
    if (maxPrix) whereClause.prix = { ...(whereClause.prix || {}), [db.Sequelize.Op.lte]: parseFloat(maxPrix) };

    const produits = await Produits.findAll({ where: whereClause });
    res.status(200).json(produits);
  } catch (error) {
    console.error('Erreur lors de la récupération du catalogue :', error.message);
    res.status(500).json({
      message: 'Erreur serveur lors de la récupération du catalogue',
      error: error.message,
    });
  }
};

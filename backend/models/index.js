const { Sequelize } = require("sequelize");
const { BDD } = require("../config");

const sequelize = new Sequelize(
  `postgres://${BDD.user}:${BDD.password}@${BDD.host}/${BDD.bdname}`,
  {
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
      ssl: true,
      native: true,
    },
    define: {
      timestamps: false,
    },
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importation des modèles
db.utilisateurs = require("./utilisateurs.model.js")(sequelize, Sequelize);
db.produits = require("./produits.model.js")(sequelize, Sequelize);
db.shoppingBag = require("./shoppingBag.model.js")(sequelize, Sequelize);

// Définition des associations
db.utilisateurs.belongsToMany(db.produits, {
  through: db.shoppingBag,
  as: "produits", // Alias utilisé pour les produits associés aux utilisateurs
  foreignKey: "utilisateurId",
});
db.produits.belongsToMany(db.utilisateurs, {
  through: db.shoppingBag,
  as: "utilisateurs", // Alias utilisé pour les utilisateurs associés aux produits
  foreignKey: "produitId",
});

db.shoppingBag.belongsTo(db.produits, {
  foreignKey: "produitId",
  as: "produit", // Alias pour accéder au modèle Produit depuis ShoppingBag
});
db.shoppingBag.belongsTo(db.utilisateurs, {
  foreignKey: "utilisateurId",
  as: "utilisateur", // Alias pour accéder au modèle Utilisateur depuis ShoppingBag
});

// Synchronisation
db.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synchronized successfully.");
  })
  .catch((err) => {
    console.error("Failed to sync database: " + err.message);
  });

module.exports = db;

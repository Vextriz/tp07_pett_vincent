module.exports = (sequelize, Sequelize) => {
const Produits = sequelize.define("produits", {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false,
  },
  titre: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  prix: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  categorie: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  utilisateurId: { // Ajout explicite de la clé étrangère
    type: Sequelize.STRING,
    allowNull: true,
  },
  quantite: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1, // Par défaut, une unité est ajoutée
  },
});
return Produits;
}

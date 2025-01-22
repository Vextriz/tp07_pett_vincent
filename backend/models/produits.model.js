module.exports = (sequelize, Sequelize) => {
  const Produits = sequelize.define("Produits", {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      autoIncrement: true,
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
  });
  return Produits;
};

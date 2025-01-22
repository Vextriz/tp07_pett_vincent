module.exports = (sequelize, Sequelize) => {
  const ShoppingBag = sequelize.define("ShoppingBag", {
    utilisateurId: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: "utilisateurs", // Table `utilisateurs`
        key: "id",
      },
    },
    produitId: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: "produits", // Table `produits`
        key: "id",
      },
    },
    quantite: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  });

  return ShoppingBag;
};

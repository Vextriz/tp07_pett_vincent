const { Sequelize } = require ("sequelize");
const { BDD }  = require ('../config');
const sequelize = new Sequelize(`postgres://${BDD.user}:${BDD.password}@${BDD.host}/${BDD.bdname}`
,{
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: true,
      native:true
    },
    define:  {
    	timestamps:false
    }
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.utilisateurs = require("./utilisateurs.model.js")(sequelize, Sequelize);
db.produits = require("./produits.model.js")(sequelize, Sequelize);

db.sequelize.sync({ force: true }) // Réinitialise les tables
  .then(() => {
    console.log("Database synced with force.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

module.exports = db;
db.utilisateurs.hasMany(db.produits, {
  as: "produits",
  foreignKey: "utilisateurId", // Correspond au champ défini dans produits.model.js
});

db.produits.belongsTo(db.utilisateurs, {
  as: "utilisateur",
  foreignKey: "utilisateurId", // Correspond au champ défini dans produits.model.js
})

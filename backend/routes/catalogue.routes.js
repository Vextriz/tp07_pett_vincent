const { checkJwt } = require('./jwtMiddleware.js');
const express = require("express");
const catalogue = require("../controllers/catalogue.controllers.js");

module.exports = (app) => {
  const router = express.Router();

  // Définition des routes
  router.post('/insert', catalogue.insertCatalogue);
  router.get("/", checkJwt, catalogue.get);

  // Utilisation des routes dans l'application
  app.use('/api/catalogue', router);
};

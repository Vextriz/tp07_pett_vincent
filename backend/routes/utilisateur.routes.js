const { checkJwt } = require('./jwtMiddleware.js');

module.exports = (app) => {
  const utilisateur = require("../controllers/utilisateur.controllers.js");

  if (!utilisateur) {
    throw new Error("Le contrôleur utilisateur.controllers.js n'a pas été importé correctement.");
  }

  const router = require("express").Router();

  router.put("/:userId/produits", checkJwt, utilisateur.addProductToUser);

  router.get("/:userId/produits", checkJwt, utilisateur.getUserProducts);

  router.delete("/:userId/produits/:productId", checkJwt, utilisateur.removeProductFromUser);

  router.post("/register", utilisateur.createUser);

  router.post("/login", utilisateur.login);

  router.put("/:userId", checkJwt, utilisateur.updateUser);

  router.delete("/:userId", checkJwt, utilisateur.deleteUser);

  app.use('/api/utilisateur', router);
};

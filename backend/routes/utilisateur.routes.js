const { checkJwt}  = require('./jwtMiddleware.js');

module.exports = app => {
    const utilisateur = require("../controllers/utilisateur.controllers.js");

    var router = require("express").Router();

    router.post("/:userId/produits", utilisateur.addProductsToUser);

    router.get("/:userId/produits", utilisateur.getUserProducts);

    router.delete("/:userId/produits/:productId",utilisateur.removeProductFromUser);

    router.post("/register", utilisateur.createUser);

    router.post("/login", utilisateur.login);

    module.exports = router;


    app.use('/api/utilisateur', router);
  };

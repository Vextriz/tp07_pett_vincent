const express = require("express");
const cors = require("cors");
const axios = require("axios"); // Pour effectuer une requête HTTP

const app = express();

var corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  headers: "Content-Type, Authorization",
  exposedHeaders: "Authorization",
};

app.use(cors(corsOptions));

// Parse requests of content-type - application/json
app.use(express.json());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to CNAM application." });
});

const db = require("./models");

// db.sequelize
//   .sync()
//   .then(async () => {
//     console.log("Synced db.");

//     // Appel automatique pour insérer le catalogue
//     try {
//       const response = await axios.post("http://localhost:443/api/catalogue/insert");
//       console.log("Catalogue inséré avec succès :", response.data.message);
//     } catch (error) {
//       console.error("Erreur lors de l'insertion du catalogue :", error.message);
//     }
//   })
//   .catch((err) => {
//     console.log("Failed to sync db: " + err.message);
//   });

require("./routes")(app);

// Set port, listen for requests
const PORT = 443;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

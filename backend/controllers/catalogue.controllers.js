exports.get = (req, res) => {
  const catalogue = [
    { id: '1', titre: 'Produit 1', prix: 100, categorie: 'Catégorie A' },
    { id: '2', titre: 'Produit 2', prix: 200, categorie: 'Catégorie B' },
    { id: '3', titre: 'Produit 3', prix: 300, categorie: 'Catégorie C' },
    { id: '4', titre: 'Produit 4', prix: 400, categorie: 'Catégorie D' },
  ];


res.setHeader('Content-Type', 'application/json');

res.send(catalogue);
};

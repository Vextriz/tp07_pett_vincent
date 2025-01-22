export interface RegisterResponses{
    message: string;
}
export interface LoginResponses{
  token:string;
}
export interface UpdateResponses{
  message: string;
}
export interface DeleteResponses{
  message: string;
}
export interface AddProductToUserResponses {
  message: string;
  produit: {
    id: string;
    titre: string;
    categorie: string;
    prix: number;
    quantite: number;
  };
}
export interface RemoveProductFromUserResponses {
  message: string;
}

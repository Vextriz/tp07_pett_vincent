import { Produit } from "./produit";
export class Utilisateur {
  public id!: string;
  public nom!: string;
  public prenom?: string;
  public login!: string;
  public pass?: string;
  public catalogue?: Produit[];
}

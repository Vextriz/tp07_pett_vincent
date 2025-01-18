import { Produit } from "../models/produit";
export class AddToCart {
  static readonly type = '[Cart] Add';
  constructor(public payload: Produit) {}
}

export class RemoveFromCart {
  static readonly type = '[Cart] Remove';
  constructor(public payload: Produit) {}
}

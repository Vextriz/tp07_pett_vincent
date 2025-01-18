import { State, Action, StateContext, Selector } from '@ngxs/store';
import { AddToCart, RemoveFromCart } from './shopping-bag.actions';
import { Produit } from '../models/produit';

export interface ShoppingBagStateModel {
  produits: Produit[]; // Liste directe des produits
}

@State<ShoppingBagStateModel>({
  name: 'shoppingBag',
  defaults: {
    produits: []
  }
})
export class ShoppingBagState {
  // Sélecteur pour récupérer la liste des produits
  @Selector()
  static getProduits(state: ShoppingBagStateModel): Produit[] {
    return state.produits;
  }

  // Sélecteur pour compter le nombre total d'articles dans le panier
  @Selector()
  static getCount(state: ShoppingBagStateModel): number {
    return state.produits.length;
  }

  // Action pour ajouter un produit au panier
  @Action(AddToCart)
  addToCart(ctx: StateContext<ShoppingBagStateModel>, action: AddToCart) {
    const state = ctx.getState();
    const updatedProduits = [...state.produits, action.payload];
    ctx.setState({
      ...state,
      produits: updatedProduits
    });
  }

  // Action pour retirer un produit du panier
  @Action(RemoveFromCart)
  removeFromCart(ctx: StateContext<ShoppingBagStateModel>, action: RemoveFromCart) {
    const state = ctx.getState();

    // Supprime uniquement le premier produit correspondant
    const indexToRemove = state.produits.findIndex(p => p.id === action.payload.id);
    if (indexToRemove > -1) {
      const updatedProduits = [...state.produits];
      updatedProduits.splice(indexToRemove, 1);
      ctx.setState({
        ...state,
        produits: updatedProduits
      });
    }
  }
}

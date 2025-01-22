import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { Produit } from '../../models/produit';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../auth/auth.service';
import { Utilisateur } from '../../models/utilisateur';
import { CardsInputComponent } from '../../card/cards-input/cards-input.component';
import { CardsListComponent } from '../../card/cards-list/cards-list.component';

@Component({
  selector: 'app-shopping-bag',
  templateUrl: './shopping-bag.component.html',
  styleUrls: ['./shopping-bag.component.css'],
  standalone: true,
  imports: [CommonModule, CardsInputComponent, CardsListComponent],
})
export class ShoppingBagComponent implements OnInit {
  userProducts: Produit[] = []; // Liste des produits de l'utilisateur
  currentUtilisateur: Utilisateur | null = null; // Utilisateur connecté
  isLoading: { [productId: string]: boolean } = {}; // Indicateur de chargement par produit

  constructor(private apiService: ApiService, private authService: AuthService) {}

  ngOnInit(): void {
    // Récupérer l'utilisateur connecté
    this.currentUtilisateur = this.authService.getCurrentUtilisateur();
    if (!this.currentUtilisateur) {
      console.error('Utilisateur non connecté');
      return;
    }

    // Charger les produits utilisateur
    this.loadUserProducts();
  }
  title = 'cardsApp';

  @ViewChild(CardsInputComponent) cardsInputComponent!: CardsInputComponent;

  handleEditRequest(event: { index: number; card: { nom: string; codePan: string; ccv: string; mois: string; annee: string } }) {
    this.cardsInputComponent.editCard(event.index, event.card);
  }

  // Charge les produits utilisateur depuis l'API
  loadUserProducts(): void {
    if (!this.currentUtilisateur) return;
    this.apiService.getUserProducts(this.currentUtilisateur.id).subscribe({
      next: (products: Produit[]) => {
        this.userProducts = products;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des produits utilisateur :', error);
      },
    });
  }

  // Calcule le total des produits
  getTotal(): number {
    return this.userProducts.reduce(
      (total, product) => total + product.prix * (product.quantite || 0),
      0
    );
  }

  // Ajoute un produit à l'utilisateur
  addProductToUser(product: Produit): void {
    if (!this.currentUtilisateur || this.isLoading[product.id]) return;

    this.isLoading[product.id] = true; // Active l'indicateur de chargement
    this.apiService.addProductUser(this.currentUtilisateur.id, product.id,product.quantite).subscribe({
      next: () => {
        const foundProduct = this.userProducts.find((p) => p.id === product.id);
        if (foundProduct) {
          foundProduct.quantite = (foundProduct.quantite || 0) + 1;
        } else {
          product.quantite = 1;
          this.userProducts.push(product);
        }
      },
      error: (err) => {
        console.error('Erreur lors de l’ajout du produit:', err);
      },
      complete: () => {
        this.isLoading[product.id] = false; // Désactive l'indicateur de chargement
      },
    });
  }

  // Supprime un produit de l'utilisateur
  removeProductFromUser(product: Produit): void {
    if (!this.currentUtilisateur || this.isLoading[product.id] || (product.quantite || 0) <= 0) return;

    this.isLoading[product.id] = true; // Active l'indicateur de chargement
    this.apiService.removeProductUser(this.currentUtilisateur.id, product.id).subscribe({
      next: () => {
        const foundProduct = this.userProducts.find((p) => p.id === product.id);
        if (foundProduct) {
          foundProduct.quantite = (foundProduct.quantite || 0) - 1;
          if (foundProduct.quantite === 0) {
            this.userProducts = this.userProducts.filter((p) => p.id !== product.id);
          }
        }
      },
      error: (err) => {
        console.error('Erreur lors de la suppression du produit:', err);
      },
      complete: () => {
        this.isLoading[product.id] = false; // Désactive l'indicateur de chargement
      },
    });
  }


}

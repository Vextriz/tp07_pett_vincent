import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../auth/auth.service';
import { Produit } from '../models/produit';
import { Utilisateur } from '../models/utilisateur';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ProductListComponent implements OnInit {
  products: Produit[] = []; // Catalogue complet des produits
  userProducts: Produit[] = []; // Produits de l'utilisateur
  currentUtilisateur: Utilisateur | null = null; // Utilisateur connecté
  isLoading: { [productId: string]: boolean } = {}; // Indicateurs de chargement par produit

  constructor(private apiService: ApiService, private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUtilisateur = this.authService.getCurrentUtilisateur();

    // Charger le catalogue de produits
    this.apiService.getCatalogue().subscribe({
      next: (data: Produit[]) => {
        this.products = data;
      },
      error: (err) => {
        console.error("Erreur lors de la récupération du catalogue :", err);
      },
    });

    // Charger les produits de l'utilisateur
    if (this.currentUtilisateur) {
      this.apiService.getUserProducts(this.currentUtilisateur.id).subscribe({
        next: (data: Produit[]) => {
          this.userProducts = data;
        },
        error: (err) => {
          console.error("Erreur lors de la récupération des produits utilisateur :", err);
        },
      });
    }
  }

  // Ajoute un produit à l'utilisateur
  addProductToUser(product: Produit): void {
    if (!this.currentUtilisateur || this.isLoading[product.id]) return;

    this.isLoading[product.id] = true; // Active l'indicateur de chargement
    this.apiService.addProductUser(this.currentUtilisateur.id, product).subscribe({
      next: (updatedProduct) => {
        const foundProduct = this.userProducts.find((p) => p.id === product.id);
        if (foundProduct) {
          foundProduct.quantite = (foundProduct.quantite || 0) + 1;
        } else {
          product.quantite = 1;
          this.userProducts.push(product);
        }
      },
      error: (err) => {
        console.error("Erreur lors de l'ajout du produit :", err);
      },
      complete: () => {
        this.isLoading[product.id] = false; // Désactive l'indicateur de chargement
      },
    });
  }

  // Retire un produit de l'utilisateur
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
        console.error("Erreur lors de la suppression du produit :", err);
      },
      complete: () => {
        this.isLoading[product.id] = false; // Désactive l'indicateur de chargement
      },
    });
  }

  // Récupère la quantité d'un produit dans la liste utilisateur
  getProductQuantity(productId: string): number {
    const product = this.userProducts.find((p) => p.id === productId);
    return product?.quantite || 0;
  }
}

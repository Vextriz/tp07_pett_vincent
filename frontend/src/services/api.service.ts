import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'; // Import de HttpClient et HttpHeaders
import { Observable } from 'rxjs';
import { environment } from '../environnement/environnement';
import { Produit } from '../models/produit';
import { AuthService } from '../auth/auth.service';
import { AddProductToUserResponses, RemoveProductFromUserResponses, UpdateResponses, DeleteResponses } from '../models/auth-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Récupérer le catalogue
  getCatalogue(filters?: { titre?: string; categorie?: string; minPrix?: string; maxPrix?: string }): Observable<Produit[]> {
    const token = this.authService.getAccessToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    let params = new HttpParams();

    // Ajout des filtres aux paramètres de la requête
    if (filters) {
      if (filters.titre) params = params.append('titre', filters.titre);
      if (filters.categorie) params = params.append('categorie', filters.categorie);
      if (filters.minPrix) params = params.append('minPrix', filters.minPrix);
      if (filters.maxPrix) params = params.append('maxPrix', filters.maxPrix);
    }

    return this.http.get<Produit[]>(`${this.apiUrl}/catalogue`, { headers, params });
  }

  getUserProducts(userId: string): Observable<Produit[]> {
    const token = this.authService.getAccessToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Produit[]>(`${this.apiUrl}/utilisateur/${userId}/produits`, { headers });
  }

/**
   * Ajouter un produit à l'utilisateur
   * @param userId Identifiant de l'utilisateur
   * @param productId Identifiant du produit
   * @param quantite Quantité à ajouter
   * @returns Observable de la réponse
   */
addProductUser(
  userId: string,
  productId: string,
  quantite: number
): Observable<AddProductToUserResponses> {
  const token = this.authService.getAccessToken();
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  const body = {
    produitId: productId,
    quantite: quantite,
  };

  return this.http.put<AddProductToUserResponses>(
    `${this.apiUrl}/utilisateur/${userId}/produits`,
    body,
    { headers }
  );
}

/**
 * Supprimer un produit de l'utilisateur
 * @param userId Identifiant de l'utilisateur
 * @param productId Identifiant du produit à supprimer
 * @returns Observable de la réponse
 */
removeProductUser(
  userId: string,
  productId: string
): Observable<RemoveProductFromUserResponses> {
  const token = this.authService.getAccessToken();
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  return this.http.delete<RemoveProductFromUserResponses>(
    `${this.apiUrl}/utilisateur/${userId}/produits/${productId}`,
    { headers }
  );
}
/**
  * Supprime un utilisateur
  * @param userId Identifiant de l'utilisateur à supprimer
  * @returns Observable contenant le message de suppression
  */
  deleteUser(userId: string): Observable<DeleteResponses> {
  const token = this.authService.getAccessToken();
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  return this.http.delete<DeleteResponses>(`${environment.apiUrl}/utilisateur/${userId}`, { headers });
  }

  /**
  * Met à jour un utilisateur
  * @param userId Identifiant de l'utilisateur à mettre à jour
  * @param updatedData Données mises à jour de l'utilisateur
  * @returns Observable contenant le message et les détails de l'utilisateur mis à jour
  */
  updateUser(
  userId: string,
  updatedData: { nom: string; prenom?: string; login: string; password?: string }
  ): Observable<UpdateResponses> {
  const token = this.authService.getAccessToken();
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  return this.http.put<UpdateResponses>(`${environment.apiUrl}/utilisateur/${userId}`, updatedData, { headers });
  }
}

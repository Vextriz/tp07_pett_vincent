import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Import de HttpClient et HttpHeaders
import { Observable } from 'rxjs';
import { environment } from '../environnement/environnement';
import { Produit } from '../models/produit';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Récupérer le catalogue
  getCatalogue(): Observable<Produit[]> {
    const token = this.authService.getAccessToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Produit[]>(`${this.apiUrl}/catalogue`, { headers });
  }

  // Récupérer les produits de l'utilisateur
  getUserProducts(userId: string): Observable<Produit[]> {
    const token = this.authService.getAccessToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Produit[]>(`${this.apiUrl}/utilisateur/${userId}/produits`, { headers });
  }

  addProductUser(userId: string, product: Produit): Observable<any> {
    const token = this.authService.getAccessToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(`${this.apiUrl}/utilisateur/${userId}/produits`, { produits: [product] }, { headers });
  }


  // Supprimer un produit de l'utilisateur
  removeProductUser(userId: string, productId: string): Observable<any> {
    const token = this.authService.getAccessToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.delete<any>(`${this.apiUrl}/utilisateur/${userId}/produits/${productId}`, { headers });
  }
}

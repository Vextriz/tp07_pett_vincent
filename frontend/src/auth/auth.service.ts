import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environnement/environnement';
import { Utilisateur } from '../models/utilisateur';
import { LoginResponses, RegisterResponses } from '../models/auth-response.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accessToken: string = ''; // Token d'accès
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false); // État d'authentification
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable(); // Observable public

  private currentUtilisateurSubject = new BehaviorSubject<Utilisateur | null>(null); // Utilisateur courant
  public currentUtilisateur$ = this.currentUtilisateurSubject.asObservable(); // Observable public

  constructor(private http: HttpClient) {}

   /**
   * Crée un nouvel utilisateur
   * @param user Détails de l'utilisateur à créer
   * @returns Observable de la réponse
   */
   createUser(user: { nom: string; prenom: string; login: string; password: string }): Observable<RegisterResponses> {
    return this.http.post<RegisterResponses>(`${environment.apiUrl}/utilisateur/register`, user);
  }

  /**
   * Authentifie un utilisateur
   * @param credentials Identifiants de connexion
   * @returns Observable de la réponse
   */
  login(credentials: { login: string; password: string }): Observable<LoginResponses> {
    return this.http.post<LoginResponses>(`${environment.apiUrl}/utilisateur/login`, credentials);
  }
  /**
   * Stocke le token d'accès et met à jour l'état d'authentification
   * @param token Le token d'accès
   */
  storeAccessToken(token: string): void {
    this.accessToken = token;
    this.isAuthenticatedSubject.next(!!token); // Met à jour l'état d'authentification
  }

  /**
   * Définit l'utilisateur actuel
   * @param user L'utilisateur actuel
   */
  setCurrentUtilisateur(user: Utilisateur): void {
    this.currentUtilisateurSubject.next(user);
  }

  /**
   * Récupère l'utilisateur actuel
   * @returns L'utilisateur actuel ou null
   */
  getCurrentUtilisateur(): Utilisateur | null {
    return this.currentUtilisateurSubject.value;
  }

  /**
   * Récupère le token d'accès
   * @returns Le token ou une chaîne vide
   */
  getAccessToken(): string {
    return this.accessToken;
  }

  /**
   * Vérifie si l'utilisateur est authentifié
   * @returns true si authentifié, false sinon
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Déconnecte l'utilisateur
   */
  logout(): void {
    this.accessToken = '';
    this.isAuthenticatedSubject.next(false); // Met à jour l'état d'authentification
    this.currentUtilisateurSubject.next(null); // Réinitialise l'utilisateur
  }
}

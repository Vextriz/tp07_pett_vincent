import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class DeleteUserComponent {
  isLoading: boolean = false; // Indicateur de chargement
  errorMessage: string | null = null; // Message d'erreur

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService
  ) {}

  deleteUser(): void {
    const currentUser = this.authService.getCurrentUtilisateur();
    if (!currentUser || !currentUser.id) {
      this.errorMessage = 'Aucun utilisateur connecté.';
      return;
    }

    const userId = currentUser.id;
    this.isLoading = true;

    this.apiService.deleteUser(userId).subscribe({
      next: (response) => {
        alert(response.message);
        this.isLoading = false;
        this.authService.logout(); // Déconnexion après suppression
        this.router.navigate(['/']); // Redirection vers la page d'accueil
      },
      error: (err) => {
        console.error('Erreur lors de la suppression de l’utilisateur :', err);
        this.errorMessage =
          'Erreur lors de la suppression de l’utilisateur. Veuillez réessayer.';
        this.isLoading = false;
      },
    });
  }
}

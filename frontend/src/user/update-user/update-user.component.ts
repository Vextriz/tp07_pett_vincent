import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../auth/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css'],
  standalone: true,
  imports: [FormsModule],
})
export class UpdateUserComponent implements OnInit {
  userId: string = ''; // Identifiant de l'utilisateur à mettre à jour
  nom: string = '';
  prenom: string = '';
  login: string = '';
  password: string = '';

  constructor(private apiService: ApiService, private router: Router, private authService : AuthService) {}

  ngOnInit(): void {
    // Pré-remplir les champs avec les informations de l'utilisateur actuel
    const currentUser = this.authService.getCurrentUtilisateur();
    if (currentUser) {
      this.userId = currentUser.id;
      this.nom = currentUser.nom || '';
      this.prenom = currentUser.prenom || '';
      this.login = currentUser.login || '';
    } else {
      alert('Utilisateur non connecté.');
      this.router.navigate(['/login']);
    }
  }

  updateUser(): void {
    const updatedUser = {
      nom: this.nom,
      prenom: this.prenom,
      login: this.login,
      password: this.password, // Laissez vide si vous ne voulez pas changer le mot de passe
    };

    this.apiService.updateUser(this.userId, updatedUser).subscribe(
      (response: any) => {
        alert('User updated successfully!');
        this.router.navigate(['/profile']); // Redirige après mise à jour
      },
      (error) => {
        alert('Error updating user!');
        console.error(error);
      }
    );
  }
}

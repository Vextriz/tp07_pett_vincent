import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { FormsModule } from '@angular/forms';
import { Utilisateur } from '../../models/utilisateur';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    const credentials = { login: this.username, password: this.password };
    this.authService.login(credentials).subscribe(
      (response: any) => {
        console.log(response)
        if (response?.accessToken && response?.user) {
          this.authService.storeAccessToken(response.accessToken);
          this.authService.setCurrentUtilisateur(response.user);
          this.router.navigate(['/products']); // Rediriger après connexion
        } else {
          alert('No token received!');
        }
      },
      (error) => {
        alert('Login failed!');
      }
    );
  }
}

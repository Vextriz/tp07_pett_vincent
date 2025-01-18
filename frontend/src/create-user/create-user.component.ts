import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
  standalone: true,
  imports: [FormsModule],
})
export class CreateUserComponent {
  nom: string = '';
  prenom: string = '';
  login: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  createUser(): void {
    const newUser = {
      nom: this.nom,
      prenom: this.prenom,
      login: this.login,
      password: this.password,
    };

    this.authService.createUser(newUser).subscribe(
      (response: any) => {
        alert('User created successfully!');
        this.router.navigate(['/register']);
      },
      (error) => {
        alert('Error creating user!');
        console.error(error);
      }
    );
  }
}

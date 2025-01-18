import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true, // Standalone component
  imports: [RouterModule, CommonModule], // Importez CommonModule ici
})
export class AppComponent implements OnInit {
  isAuthenticated: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef // Injection correcte
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe((authStatus) => {
      this.isAuthenticated = authStatus;
      this.cd.detectChanges(); // Force la détection des changements
    });
  }

  logout(): void {
    this.authService.logout();
    this.isAuthenticated = false;
    this.router.navigate(['/login']);
  }
}

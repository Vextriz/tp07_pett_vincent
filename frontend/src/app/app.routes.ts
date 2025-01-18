import { Routes } from '@angular/router';
import { CreateUserComponent } from '../create-user/create-user.component';
import { LoginComponent } from '../login/login.component';
import { ProductListComponent } from '../product-list/product-list.component';
import { ShoppingBagComponent } from '../shopping-bag/shopping-bag.component';
import { AuthGuard } from '../auth/auth.guard';

export const routes: Routes = [
  { path: 'register', component: CreateUserComponent },
  { path: 'login', component: LoginComponent }, // Route pour la connexion
  { path: 'products', component: ProductListComponent, canActivate: [AuthGuard] },
  { path: 'shoppingBag', component: ShoppingBagComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirection par défaut vers /login
  { path: '**', redirectTo: '/login' }, // Redirection pour les routes non reconnues
];

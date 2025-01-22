import { Routes } from '@angular/router';
import { CreateUserComponent } from '../user/create-user/create-user.component';
import { LoginComponent } from '../user/login/login.component';
import { ProductListComponent } from '../product/product-list/product-list.component';
import { ShoppingBagComponent } from '../product/shopping-bag/shopping-bag.component';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateUserComponent } from '../user/update-user/update-user.component';
import { DeleteUserComponent } from '../user/delete-user/delete-user.component';

export const routes: Routes = [
  { path: 'register', component: CreateUserComponent },
  { path: 'login', component: LoginComponent }, // Route pour la connexion
  { path: 'products', component: ProductListComponent, canActivate: [AuthGuard] },
  { path: 'shoppingBag', component: ShoppingBagComponent, canActivate: [AuthGuard] },
  { path: 'update', component: UpdateUserComponent, canActivate: [AuthGuard] },
  { path: 'delete', component: DeleteUserComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirection par défaut vers /login
  { path: '**', redirectTo: '/login' }, // Redirection pour les routes non reconnues
];

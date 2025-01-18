import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { ShoppingBagComponent } from '../shopping-bag/shopping-bag.component';
import { ProductFilterComponent } from '../product-filter/product-filter.component';
import { ShoppingBagState } from '../store/shopping-bag.state';
@NgModule({
  declarations: [
    AppComponent,
    ShoppingBagComponent,
    ProductFilterComponent,
    ProductFilterComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes), // Ajout si vous utilisez Router
    NgxsStoragePluginModule.forRoot({ keys: ['shoppingBag'] })
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }

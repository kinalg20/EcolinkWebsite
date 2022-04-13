import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductCartComponent } from './product-cart/product-cart.component';
import { ProductCheckoutComponent } from './product-checkout/product-checkout.component';
import { ProductWishlistComponent } from './product-wishlist/product-wishlist.component';
import { ProductdetailComponent } from './productdetail.component';

const routes: Routes = [
  { path: '', component: ProductdetailComponent },
  { path: 'cart', component: ProductCartComponent },
  { path: 'checkout', component: ProductCheckoutComponent },
  { path: 'wishlist', component: ProductWishlistComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductdetailRoutingModule { }

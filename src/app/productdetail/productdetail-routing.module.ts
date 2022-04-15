import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductCheckoutComponent } from './product-checkout/product-checkout.component';
import { ProductWishlistComponent } from './product-wishlist/product-wishlist.component';
import { ProductdetailComponent } from './productdetail.component';
import { ShopComponent } from './shop/shop.component';

const routes: Routes = [
  {
    path: '', component: ProductdetailComponent,
    children: [
      {
        path: ':category/:slug', component: ShopComponent,
      },
      {
        path: 'checkout', component: ProductCheckoutComponent,
      },
      {
        path: 'wishlist', component: ProductWishlistComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductdetailRoutingModule { }

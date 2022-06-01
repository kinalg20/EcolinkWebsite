import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderFailComponent } from '../shared/order-fail/order-fail.component';
<<<<<<< HEAD
import { PageNotFoundComponent } from '../shared/page-not-found/page-not-found.component';
=======
>>>>>>> e440f1b643078bda9e91b04cf33324b063921ae8
import { ThankYouComponent } from '../shared/thank-you/thank-you.component';
import { MainDetailComponent } from './main-detail/main-detail.component';
import { ProductCheckoutComponent } from './product-checkout/product-checkout.component';
import { ProductWishlistComponent } from './product-wishlist/product-wishlist.component';
import { ProductdetailComponent } from './productdetail.component';
import { ShopComponent } from './shop/shop.component';

const routes: Routes = [
  {
<<<<<<< HEAD
    path: '', component: ProductdetailComponent,
=======
    path: 'shop', component: ProductdetailComponent,
>>>>>>> e440f1b643078bda9e91b04cf33324b063921ae8
    children: [
      {
        path: '', component: MainDetailComponent,
      },
      {
        path: ':category/:slug/:subslug/:subsublug', component: ShopComponent,
      },
      {
        path: ':category/:slug/:subslug', component: ShopComponent,
      },
      {
        path: ':category/:slug', component: ShopComponent,
      },
      {
        path: 'checkout', component: ProductCheckoutComponent,
      },
      {
        path: 'wishlist', component: ProductWishlistComponent,
<<<<<<< HEAD
      },
    ]
  },
  { path: 'thanks', component: ThankYouComponent },
  { path: 'failed', component: OrderFailComponent },
=======
      }
    ]
  },
  { path: 'thanks', component: ThankYouComponent },
  { path: 'failed', component: OrderFailComponent }
>>>>>>> e440f1b643078bda9e91b04cf33324b063921ae8
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductdetailRoutingModule { }

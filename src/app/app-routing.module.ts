import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { ProductCartComponent } from './product-cart/product-cart.component';

const routes: Routes = [
  { path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: 'shared', loadChildren: () => import('./shared/shared.module').then(m => m.SharedModule) },
  { path: 'product-category', loadChildren: () => import('./productlist/productlist.module').then(m => m.ProductlistModule) },
<<<<<<< HEAD
  { path: 'shop', loadChildren: () => import('./productdetail/productdetail.module').then(m => m.ProductdetailModule) },
=======
  { path: '', loadChildren: () => import('./productdetail/productdetail.module').then(m => m.ProductdetailModule) },
>>>>>>> e440f1b643078bda9e91b04cf33324b063921ae8
  { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule) },
  { path: 'cart', component: ProductCartComponent , pathMatch:"full"},
  { path: '', loadChildren: () => import('./innerpages/innerpages.module').then(m => m.InnerpagesModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: "enabled"
  }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) }, 
  { path: 'shared', loadChildren: () => import('./shared/shared.module').then(m => m.SharedModule) }, 
  { path: 'product-category/:slug', loadChildren: () => import('./productlist/productlist.module').then(m => m.ProductlistModule) }, 
  { path: 'shop', loadChildren: () => import('./productdetail/productdetail.module').then(m => m.ProductdetailModule) },
  { path: 'profile' ,loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)}, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    scrollPositionRestoration:"enabled"
  }),
],
  exports: [RouterModule]
})
export class AppRoutingModule { }

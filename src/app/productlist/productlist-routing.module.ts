import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductlistComponent } from './productlist.component';

const routes: Routes = [
  { path: ':slug', component: ProductlistComponent },
  { path: ':slug/:sublink', component: ProductlistComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductlistRoutingModule { }

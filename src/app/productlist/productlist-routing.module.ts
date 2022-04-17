import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductlistComponent } from './productlist.component';

const routes: Routes = [{
  path: ':slug', component: ProductlistComponent,
  children: [
    {
      path: ':slug', component: ProductlistComponent,
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductlistRoutingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductdetailRoutingModule } from './productdetail-routing.module';
import { ProductdetailComponent } from './productdetail.component';
import { SharelibraryModule } from '../sharelibrary/sharelibrary.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ProductCartComponent } from './product-cart/product-cart.component';
import { ProductWishlistComponent } from './product-wishlist/product-wishlist.component';
import { ProductCheckoutComponent } from './product-checkout/product-checkout.component';


@NgModule({
  declarations: [
    ProductdetailComponent,
    ProductCartComponent,
    ProductWishlistComponent,
    ProductCheckoutComponent
  ],
  imports: [
    CommonModule,
    ProductdetailRoutingModule,
    SharelibraryModule,
    FormsModule,
    SharedModule
  ]
})
export class ProductdetailModule { }

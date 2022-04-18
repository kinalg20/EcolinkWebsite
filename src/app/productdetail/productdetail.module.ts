import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductdetailRoutingModule } from './productdetail-routing.module';
import { ProductdetailComponent } from './productdetail.component';
import { SharelibraryModule } from '../sharelibrary/sharelibrary.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ProductWishlistComponent } from './product-wishlist/product-wishlist.component';
import { ProductCheckoutComponent } from './product-checkout/product-checkout.component';
import { ShopComponent } from './shop/shop.component';
import { MainDetailComponent } from './main-detail/main-detail.component';
import { HomeModule } from '../home/home.module';



@NgModule({
  declarations: [
    ProductdetailComponent,
    ProductWishlistComponent,
    ProductCheckoutComponent,
    ShopComponent,
    MainDetailComponent
  ],
  imports: [
    CommonModule,
    ProductdetailRoutingModule,
    SharelibraryModule,
    FormsModule,
    SharedModule,
    HomeModule
  ]
})
export class ProductdetailModule { }

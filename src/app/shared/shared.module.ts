import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { SharedComponent } from './shared.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CardSliderComponent } from './card-slider/card-slider.component';
import { SharelibraryModule } from '../sharelibrary/sharelibrary.module';
import { CallToActionComponent } from './call-to-action/call-to-action.component';
import { MediaBannerComponent } from './media-banner/media-banner.component';
import { TrendingPostComponent } from './trending-post/trending-post.component';
import { InnerPagesComponent } from './inner-pages/inner-pages.component';
import { FormsModule } from '@angular/forms';
import { ProductsRequestComponent } from './products-request/products-request.component';
import { ReturnProductListingComponent } from './return-product-listing/return-product-listing.component';
import { GoogleMapComponent } from './google-map/google-map.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { OrderFailComponent } from './order-fail/order-fail.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const exportdata: any = [
  HeaderComponent,
  FooterComponent,
  CardSliderComponent,
  CallToActionComponent,
  MediaBannerComponent,
  GoogleMapComponent,
  TrendingPostComponent
]

@NgModule({
  declarations: [
    SharedComponent,
    HeaderComponent,
    FooterComponent,
    CardSliderComponent,
    ...exportdata,
    CallToActionComponent,
    MediaBannerComponent,
    TrendingPostComponent,
    InnerPagesComponent,
    ProductsRequestComponent,
    ReturnProductListingComponent,
    ThankYouComponent,
    OrderFailComponent,
    PageNotFoundComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    SharelibraryModule,
    FormsModule,
  ],
  exports: [
    ...exportdata
  ]
})
export class SharedModule { }

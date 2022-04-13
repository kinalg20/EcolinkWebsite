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

const exportdata:any =[
  HeaderComponent,
  FooterComponent,
  CardSliderComponent,
  CallToActionComponent,
  MediaBannerComponent,
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
    TrendingPostComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule, 
    SharelibraryModule
  ],
  exports: [
    ...exportdata
  ]
})
export class SharedModule { }

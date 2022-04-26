import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { HomeBannerComponent } from './home-banner/home-banner.component';
import { SharedModule } from '../shared/shared.module';
import { AboutUsComponent } from './about-us/about-us.component';
import { MediaComponent } from './media/media.component';
import { SharelibraryModule } from '../sharelibrary/sharelibrary.module';
import { BlogComponent } from './blog/blog.component';
import { ManufactureComponent } from './manufacture/manufacture.component';
// import { AskChemistComponent } from '../shared/ask-chemist/ask-chemist.component';
import { FormsModule } from '@angular/forms';
import { CategoriesComponent } from './categories/categories.component';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';



const exportdata:any =[
 CategoriesComponent,
 BlogComponent
]

@NgModule({
  declarations: [
    HomeComponent,
    HomeBannerComponent,
    AboutUsComponent,
    MediaComponent,
    BlogComponent,
    ManufactureComponent,
    // AskChemistComponent,
    CategoriesComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    SharelibraryModule,
    FormsModule,
    NgxShimmerLoadingModule
  ],

  exports:[
    ...exportdata
  ]
})
export class HomeModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductlistRoutingModule } from './productlist-routing.module';
import { ProductlistComponent } from './productlist.component';
import { SharelibraryModule } from '../sharelibrary/sharelibrary.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { SearchPipePipe } from '../custom-pipe/search-pipe.pipe';

const exportdata: any = [
  SearchPipePipe
]

@NgModule({
  declarations: [
    ProductlistComponent,
    ...exportdata
  ],
  imports: [
    CommonModule,
    ProductlistRoutingModule,
    SharelibraryModule,
    FormsModule,
    SharedModule,
  ],
  exports : [
    ...exportdata
  ]

})
export class ProductlistModule { }

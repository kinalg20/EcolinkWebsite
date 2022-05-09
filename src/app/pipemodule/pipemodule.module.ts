import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchPipePipe } from '../custom-pipe/search-pipe.pipe';


const exportData :any = [
    SearchPipePipe
]

@NgModule({
  declarations: [
    ...exportData
  ],
  imports: [
    CommonModule
  ],
  exports :[
    ...exportData
  ]
})
export class PipemoduleModule { }

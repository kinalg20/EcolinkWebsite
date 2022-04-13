import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchPipe'
})
export class SearchPipePipe implements PipeTransform {

  transform(value:any, searchTerm: any): any {
    return value.filter(function(search:any){
       return search.name.indexOf(searchTerm) > -1
    })
  }

}

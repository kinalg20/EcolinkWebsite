import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';

@Component({
  selector: 'app-products-request',
  templateUrl: './products-request.component.html',
  styleUrls: ['./products-request.component.scss']
})
export class ProductsRequestComponent implements OnInit {
  slug:any;
  data : any = []
  constructor(private route: ActivatedRoute , private _apiService :ApiServiceService) { }

  ngOnInit(): void {
    this.slug = this.route.snapshot.params;
    if(this.slug.sublink){
      this._apiService.getPageBySlug(this.slug.sublink).subscribe((res:any)=>{
        this.data = res.data;
        console.log(res);
      })
    }
    else{
      this._apiService.getPageBySlug(this.slug).subscribe((res:any)=>{
        this.data = res.data;
        console.log(res);
      })
    }
  }

}

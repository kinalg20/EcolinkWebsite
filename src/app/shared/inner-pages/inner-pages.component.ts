import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';

@Component({
  selector: 'app-inner-pages',
  templateUrl: './inner-pages.component.html',
  styleUrls: ['./inner-pages.component.scss']
})
export class InnerPagesComponent implements OnInit {
  slug:any;
  data : any = []
  constructor(private route: ActivatedRoute , public _apiService :ApiServiceService ) { }

  ngOnInit(): void {
    this.slug = this.route.snapshot.params;
    if(this.slug.subsubsublink){
      this._apiService.getPageBySlug(this.slug.subsubsublink).subscribe((res:any)=>{
        this.data = res.data;
        console.log(res);
      })
    }
    if(this.slug.subsublink){
      this._apiService.getPageBySlug(this.slug.subsublink).subscribe((res:any)=>{
        this.data = res.data;
        console.log(res);
      })
    }
    if(this.slug.sublink){
      this._apiService.getPageBySlug(this.slug.sublink).subscribe((res:any)=>{
        this.data = res.data;
        console.log(res);
      })
    }
    if(this.slug.slug){
      this._apiService.getPageBySlug(this.slug.slug).subscribe((res:any)=>{
        this.data = res.data;
        console.log(res);
      })
    }
    // else{
    //   this._apiService.getPageBySlug(this.slug).subscribe((res:any)=>{
    //     this.data = res.data;
    //     console.log(res);
    //   })
    // }
  }
  
}

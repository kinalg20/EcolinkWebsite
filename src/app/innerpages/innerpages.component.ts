import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';

@Component({
  selector: 'app-innerpages',
  templateUrl: './innerpages.component.html',
  styleUrls: ['./innerpages.component.scss']
})
export class InnerpagesComponent implements OnInit {

  slug:any;
  data : any = []
  constructor(private route: ActivatedRoute , public _apiService :ApiServiceService ) { }

  ngOnInit(): void {
    this.slug = this.route.snapshot.params;
    console.log(this.slug);
    if(this.slug.subsubsublink){
      this._apiService.getPageBySlug(this.slug.subsubsublink).subscribe((res:any)=>{
        this.data = res.data;
        console.log("inner-page route",res);
      })
    }
    else if(this.slug.subsublink){
      console.log(this.slug.subsublink);
      this._apiService.getPageBySlug(this.slug.subsublink).subscribe((res:any)=>{
        this.data = res.data;
        console.log("inner-page route",res);
      })
    }
    else if(this.slug.sublink){
      this._apiService.getPageBySlug(this.slug.sublink).subscribe((res:any)=>{
        this.data = res.data;
        console.log("inner-page route",res);
      })
    }
    else if(this.slug.slug){
      this._apiService.getPageBySlug(this.slug.slug).subscribe((res:any)=>{
        this.data = res.data;
        console.log("inner-page route",res);
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

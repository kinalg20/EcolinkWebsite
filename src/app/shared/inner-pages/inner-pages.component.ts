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
  constructor(private route: ActivatedRoute , private _apiService :ApiServiceService) { }

  ngOnInit(): void {
    this.slug = this.route.snapshot.params;
    this._apiService.getPageBySlug(this.slug).subscribe((res:any)=>{
      this.data = res.data;
      console.log(res);
    })

  }
  
}

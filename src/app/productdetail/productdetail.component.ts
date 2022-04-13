import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiServiceService } from '../Services/api-service.service';

@Component({
  selector: 'app-productdetail',
  templateUrl: './productdetail.component.html',
  styleUrls: ['./productdetail.component.scss']
})
export class ProductdetailComponent implements OnInit {
  count:any=1;
  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];
  productDetail : any = [];

  products = [
    {
      id: 1,
      name: "ECC (A) 13oz Aerosol – Case of 12 –",
      price: "$448"
    },
    {
      id: 2,
      name: "ECC (A) 13oz Aerosol – Case of 12 –",
      price: "$448"
    },
    {
      id: 3,
      name: "ECC (A) 13oz Aerosol – Case of 12 –",
      price: "$448"
    },
    {
      id: 4,
      name: "ECC (A) 13oz Aerosol – Case of 12 –",
      price: "$448"
    },
    {
      id: 5,
      name: "ECC (A) 13oz Aerosol – Case of 12 –",
      price: "$448"
    },
    {
      id: 6,
      name: "ECC (A) 13oz Aerosol – Case of 12 –",
      price: "$448"
    },
    {
      id: 7,
      name: "ECC (A) 13oz Aerosol – Case of 12 –",
      price: "$448"
    }
  ]
  constructor(public _ApiService :ApiServiceService , private route: ActivatedRoute) { }

  ngOnInit(): void {
    let slug = this.route.snapshot.queryParams;
    console.log(slug);
    // this.getProductDetail(slug);
  }

  Count(string:any){
    if(string=="increase" && this.count<10){
      this.count=this.count+1;
    }
    if(string=="decrease" && this.count>1){
      this.count=this.count-1;
    }
  }

  getProductDetail(slug:any){
    this._ApiService.getProductDetail(slug).subscribe((res:any)=>{
      this.productDetail.push(res);
    })

    setTimeout(() => {
      console.log(this.productDetail);
    }, 500);
  }
}

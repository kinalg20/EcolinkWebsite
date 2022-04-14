import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from 'src/app/Services/api-service.service';

@Component({
  selector: 'app-product-wishlist',
  templateUrl: './product-wishlist.component.html',
  styleUrls: ['./product-wishlist.component.scss']
})
export class ProductWishlistComponent implements OnInit {
  product : any = [];
  constructor(private _ApiService : ApiServiceService) { }

  ngOnInit(): void {
    this._ApiService.getWishListItem().subscribe(res=>{
      console.log(res);
      this.product.push(res.data);
      console.log(this.product);
    })
  }
}

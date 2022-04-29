import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from 'src/app/Services/api-service.service';

@Component({
  selector: 'app-product-wishlist',
  templateUrl: './product-wishlist.component.html',
  styleUrls: ['./product-wishlist.component.scss']
})
export class ProductWishlistComponent implements OnInit {
  product: any = [];
  wishlistShimmer: boolean = true;
  constructor(private _ApiService: ApiServiceService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.getWishlistItems();
    }, 500);
  }

  addProductToCart(prod: any) {
    this._ApiService.addItemToCart(prod.product_id, 1, "add").subscribe((res: any) => {
      console.log(res);
    })
  }

  getWishlistItems() {
    this.wishlistShimmer= true;
    this.product = [];
    this._ApiService.getWishListItem().subscribe(res => 
      {
      if (res.code == 200) {
        console.log(res);
        this.product.push(res.data);
        this.wishlistShimmer = false;
      }
    },
    (error: HttpErrorResponse) => {
      if (error.error.code == 400) {
        console.log("400");
        this.product = [];
        this.wishlistShimmer = false;
      }
      console.log(error.error.code);
    })
  }

  deleteWishlistItems(product_id: any) {
    this._ApiService.deleteWishlistItems(product_id).subscribe((res: any) => {
      console.log(res);
    })
    this.getWishlistItems();
  }
}

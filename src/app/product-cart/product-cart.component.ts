import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { CookiesService } from 'src/app/Services/cookies.service';

@Component({
  selector: 'app-product-cart',
  templateUrl: './product-cart.component.html',
  styleUrls: ['./product-cart.component.scss']
})
export class ProductCartComponent implements OnInit {
  CardShow: any = [];
  GetProduct: any = [];
  SubTotal: number = 0;
  UserLogin: any;

  constructor(private _ApiService: ApiServiceService, private _cookies: CookiesService, private primengConfig: PrimeNGConfig) { }

  ngOnInit(): void {
    this.getCartData();
    this.UserLogin = localStorage.getItem('ecolink_user_credential');
  }

  Count(string: any, id: any) {
    if (string == "increase" && this.CardShow[id].quantity < 10) {
      this.CardShow[id].quantity = this.CardShow[id].quantity + 1;
      this.subtotal();
    }
    if (string == "decrease" && this.CardShow[id].quantity > 1) {
      this.CardShow[id].quantity = this.CardShow[id].quantity - 1;
      this.subtotal();
    }
    // if(string == "increase") {
    //   this.CardShow = this.CardShow.map((product:any) => {
    //     if(product.id === id){
    //       return {
    //         ...product,
    //         quantity:product.quantity + 1
    //       }
    //     }
    //     this.subtotal();
    //     return product;
    //   })
    // }
    // if(string == "decrease") {
    //   this.CardShow = this.CardShow.map((product:any) => {
    //     if(product.id === id){
    //       return {
    //         ...product,
    //         quantity: product.quantity > 1 ? product.quantity - 1 : product.quantity
    //       }
    //     }
    //     this.subtotal();
    //     return product;
    //   })
    // }
  }

  getCartData() {
    let cookiesdata: any = [];
    let data_obj: any = [];
    let completedFormat: any = {};
    if (localStorage.getItem('ecolink_user_credential') == null) {
      cookiesdata = this._cookies.GetCartData();
      cookiesdata.map((res: any) => {
        this._ApiService.getProductById(res.CartProductId).subscribe((resp: any) => {
          let data: any = {};
          let products: any = {};
          data.quantity = res.ProductQuantity;
          data.product_id = resp.data.id;
          products.id = res.CartProductId;
          products.name = resp.data.name;
          products.sale_price = resp.data.sale_price;
          products.image = resp.data.image;
          products.alt = resp.data.alt;
          data.product = products;
          data_obj.push(data);
          completedFormat.data = data_obj;
        })
      })
      setTimeout(() => {
        this.CardShow = completedFormat.data;
      }, 5000);
    }
    else {
      this._ApiService.getItemFromCart().subscribe(res => {
        console.log(res);
        setTimeout(() => {
          this.CardShow = res.data;
          this.subtotal();
          console.log(this.CardShow);
        }, 1000);
      })
    }
  }


  subtotal() {
    this.SubTotal = 0;
    this.CardShow.map((res: any) => {
      this.SubTotal = this.SubTotal + res.product.sale_price * res.quantity;
    })
  }

  UpdateCart(action: any, product_id: any, product_quantity: any) {
    console.log(product_id);
    let cookiesdata: any = [];
    if (this.UserLogin! = null) {
      if (action == 'delete' && product_quantity > 1) {
        this._ApiService.addItemToCart(product_id, 1, action).subscribe(res =>
          console.log(res));
        setTimeout(() => {
          this.getCartData();
        }, 1500);
      }

      if (action == 'add') {
        this._ApiService.addItemToCart(product_id, 1, action).subscribe(res =>
          console.log(res));
        setTimeout(() => {
          this.getCartData();
        }, 500);
      }
    }
    else {
      cookiesdata = this._cookies.GetCartData();
      console.log("data",this.CardShow);
      setTimeout(() => {
        // console.log(cookiesdata);
      }, 1000);
    }
  }

  deleteItemFromCart(product_id: any) {
    console.log(product_id);
    this._ApiService.deleteItemFromCart(product_id).subscribe(res => console.log(res));
    // setTimeout(() => {
    setTimeout(() => {
      this.getCartData();
    }, 2000);
  }
}

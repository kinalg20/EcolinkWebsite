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

  constructor(private _ApiService: ApiServiceService, private _cookies: CookiesService, private primengConfig: PrimeNGConfig) { }

  ngOnInit(): void {
    this.getCartData();
    this.primengConfig.ripple = true;
  }
  products = [
    {
      id: 1,
      name: "ECC (A) 13oz Aerosol – Case of 12 – Discontinued",
      price: 30,
      category: "Aerosol",
      quantity: 2

    },
    {
      id: 2,
      name: "ECC (A) 13oz Aerosol – Case of 12 – Discontinued",
      price: 30,
      category: "Aerosol",
      quantity: 1

    },
    {
      id: 3,
      name: "ECC (A) 13oz Aerosol – Case of 12 – Discontinued",
      price: 30,
      category: "Aerosol",
      quantity: 2

    },
    {
      id: 4,
      name: "ECC (A) 13oz Aerosol – Case of 12 – Discontinued",
      price: 30,
      category: "Aerosol",
      quantity: 2

    },
    {
      id: 5,
      name: "ECC (A) 13oz Aerosol – Case of 12 – Discontinued",
      price: 30,
      category: "Aerosol",
      quantity: 2

    },
    {
      id: 6,
      name: "ECC (A) 13oz Aerosol – Case of 12 – Discontinued",
      price: 30,
      category: "Aerosol",
      quantity: 2

    }
  ]

  Count(string: any, id: any) {
    // if (string == "increase" && this.CardShow[id].quantity < 10) {
    //   this.CardShow[id].quantity = this.CardShow[id].quantity + 1;
    //   this.subtotal();
    // }
    // if (string == "decrease" && this.CardShow[id].quantity > 1) {
    //   this.CardShow[id].quantity = this.CardShow[id].quantity - 1;
    //   this.subtotal();
    // }
    if(string == "increase") {
      this.CardShow = this.CardShow.map((product:any) => {
        if(product.id === id){
          return {
            ...product,
            quantity:product.quantity + 1
          }
        }
        this.subtotal();
        return product;
      })
    }
    if(string == "decrease") {
      this.products = this.products.map((product:any) => {
        if(product.id === id){
          return {
            ...product,
            quantity: product.quantity > 1 ? product.quantity - 1 : product.quantity
          }
        }
        this.subtotal();
        return product;
      })
    }
  }

  getCartData() {
    if (localStorage.getItem('ecolink_user_credential') == null) {
      let data = this._cookies.GetCartData();
      data.map((res: any) => {
        this._ApiService.getDetailByCategory(res.ProductCategory).subscribe((resp: any) => {
          resp.data.products.map((response: any) => {
            if (res.CartProductId == response.id) {
              response.quantity = res.ProductQuantity;
              this.SubTotal = this.SubTotal + response.regular_price;
              this.CardShow.push(response);
              localStorage.setItem("CheckoutData", JSON.stringify(this.CardShow));
            }
          })
        })
      })
    }

    else {
      this._ApiService.getItemFromCart().subscribe(res => {
        setTimeout(() => {
          this.CardShow = res.data;
          this.subtotal();
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

  UpdateCart(action: any, product_id: any) {
    this._ApiService.addItemToCart(product_id, 1, action).subscribe(res =>
      console.log(res));
    setTimeout(() => {
      this.getCartData();
    }, 400);
  }

  deleteItemFromCart(product_id: any) {
    console.log(product_id);
    this._ApiService.deleteItemFromCart(product_id).subscribe(res =>console.log(res));
    // setTimeout(() => {
      this.getCartData();
  }
}

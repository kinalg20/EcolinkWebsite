import { HttpErrorResponse } from '@angular/common/http';
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
  length: any = 0
  SubTotal: number = 0;
  UserLogin: any;
  CartShimmer: boolean = true;

  constructor(private _ApiService: ApiServiceService, private _cookies: CookiesService, private primengConfig: PrimeNGConfig) { }
  ngOnInit(): void {
    this.UserLogin = localStorage.getItem('ecolink_user_credential');
    setTimeout(() => {
      this.getCartData();
    }, 300);
  }

  Count(string: any, id: any) {
    if (string == "add" && this.CardShow[id].quantity < 10) {
      this.CardShow[id].quantity = this.CardShow[id].quantity + 1;
      this.subtotal();
    }
    if (string == "delete" && this.CardShow[id].quantity > 1) {
      this.CardShow[id].quantity = this.CardShow[id].quantity - 1;
      this.subtotal();
    }
  }

  async getCartData() {
    let cookiesdata: any = [];
    let data_obj: any = [];
    let completedFormat: any = {};
    if (localStorage.getItem('ecolink_user_credential') === null) {
      cookiesdata = this._cookies.GetCartData();
      if (cookiesdata != 'empty') {
        console.log(cookiesdata.length);
        this.length = cookiesdata.length;
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
          if (completedFormat.data) {
            this.CardShow = completedFormat.data;
            this.subtotal();
            this.CartShimmer = false;
          }
          else if (!completedFormat.data) {
            console.log("hjbhjbbhj");

            this.CartShimmer = false;
            this.CardShow = [];
          }
        },
          1500);
      }
      else {
        this.CardShow = [];
        this.CartShimmer = false;
      }
    }
    else {
      await this._ApiService.getItemFromCart()
        .then(
          (res) => {
            if (res.code == 200) {
              this.CardShow = res.data;
              this.subtotal();
              console.log(this.CardShow);
              this.CartShimmer = false;
              this.length = this.CardShow.length;
            }
          })
        .catch(
          (error) => {
            if (error.error.code == 400) {
              this.CardShow = [];
              this.CartShimmer = false;
              this.length = 0;
            }
          }
        )
      // this._ApiService.getItemFromCart().subscribe(
      //   res => {
      //     console.log(res.code);
      //     if (res.code == 200) {
      //       setTimeout(() => {
      //         this.CardShow = res.data;
      //         this.subtotal();
      //         console.log(this.CardShow);
      //         this.CartShimmer = false;
      //         this.length = this.CardShow.length;
      //       }, 1500);
      //     }

      //   },
      //   (error: HttpErrorResponse) => {
      //     if (error.error.code == 400) {
      //       this.CardShow = [];
      //       this.CartShimmer = false;
      //       this.length = 0;
      //     }
      //   })
    }
  }


  subtotal() {
    this.SubTotal = 0;
    this.CardShow.map((res: any) => {
      this.SubTotal = this.SubTotal + res.product.sale_price * res.quantity;
    })
  }


  ItemCart: any;
  async UpdateCart(action: any, product_id: any, product_quantity: any, rowIndex: any) {
    if (localStorage.getItem('ecolink_user_credential') === null) {
      this.CartShimmer = true;
      this.Count(action, rowIndex);
      // setTimeout(() => {
      let saveDataInCookies: any = [];
      let cookiesObject: any = {}
      this.CardShow.map((res: any) => {
        cookiesObject = {
          "CartProductId": res.product_id,
          "ProductQuantity": res.quantity
        }
        saveDataInCookies.push(cookiesObject);
      })
      console.log(saveDataInCookies);
      this._cookies.SaveCartData(saveDataInCookies);
      this.getCartData();
      // }, 1000);
      this.subtotal();
    }
    else {
      this.CartShimmer = true;
      if (action == 'delete' && product_quantity > 1) {
        this.ItemCart = await this._ApiService.addItemToCart(product_id, 1, action).then((res) => {
          return res;
        })

        if (this.ItemCart.code == 200) {
          this.getCartData();
          this.subtotal();
        }

      }

      else if (action == 'add') {
        this.ItemCart = await this._ApiService.addItemToCart(product_id, 1, action).then((res) => {
          return res;
        })

        if (this.ItemCart.code == 200) {
          this.getCartData();
          this.subtotal();
        }
      }

      else{
        this.getCartData();
        this.subtotal();
      }
    }
  }


  // async updateFunction(product_id: any, action: any) {
  //   return await this._ApiService.addItemToCart(product_id, 1, action);
  // }

  cookies_data: any = [];
  deleteItemFromCart(product: any) {
    if (this.UserLogin != null) {
      this.CartShimmer = true;
      this._ApiService.deleteItemFromCart(product.product.id).subscribe(res => console.log(res));
      setTimeout(() => {
        this.getCartData();
      }, 1000);
    }

    else {
      this.CartShimmer = true;
      this.cookies_data = this._cookies.GetCartData();
      this.cookies_data.map((resp: any) => {
        if (product.product_id == resp.CartProductId) {
          this.cookies_data.splice(this.cookies_data.indexOf(resp), 1);
          this._cookies.SaveCartData(this.cookies_data);
          this.getCartData();
        }
      })
    }
  }

  StoreCookiesData() {
    this._ApiService.cookiesCheckoutData.next(this.CardShow);
    localStorage.setItem("payable", JSON.stringify(this.SubTotal));
    // localStorage.setItem("payable", JSON.stringify(this.SubTotal));
  }

}

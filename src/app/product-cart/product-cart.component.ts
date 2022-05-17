import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  disableIncreaseButton: boolean = false;
  disableDecreaseButton: boolean = false;

  constructor(private _ApiService: ApiServiceService, private _cookies: CookiesService, private primengConfig: PrimeNGConfig, private route: Router) { }
  ngOnInit(): void {
    this.UserLogin = localStorage.getItem('ecolink_user_credential');
    this.getCartData();
  }

  Count(string: any, id: any) {
    if (string == "add") {
      if (this.CardShow[id].quantity <= 24) {
        this.CardShow[id].quantity = this.CardShow[id].quantity + 1;
        this.subtotal();
      }
      // else {
      //   this.disableIncreaseButton = true;
      // }
    }
    if (string == "delete") {
      if (this.CardShow[id].quantity == 2) {
        this.CardShow[id].quantity = this.CardShow[id].quantity - 1;
        this.subtotal();
      }
      // else {
      //   this.disableDecreaseButton = true;
      // }
    }
  }
  // if (product_quantity <= 24) {
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
            console.log(res);
            this.CardShow = res.data;
            this.subtotal();
            console.log(this.CardShow);
            this.CartShimmer = false;
            this.length = this.CardShow.length;
          })
        .catch(
          (error) => {
            console.log(error)
            if (error.error.code == 400) {
              this.CardShow = [];
              this.CartShimmer = false;
              this.length = 0;
            }
            else if (error.status == 401) {
              localStorage.removeItem('ecolink_user_credential');
              this.route.navigateByUrl('profile/auth');
            }
          }
        )
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
      this.subtotal();
    }
    else {
      this.CartShimmer = true;
      if (action == 'delete') {
        // if (product_quantity > 2) {
          this.ItemCart = await this._ApiService.addItemToCart(product_id, 1, action)
            .then((res) => {
              return res;
            })
            .catch(error => {
              return error.error.code;
            })

          if (this.ItemCart.code == 200) {
            this.getCartData();
            this.subtotal();
          }
        // }

        // else {
        //   this.disableDecreaseButton = true;
        // }

      }

      else if (action == 'add') {
        // if (product_quantity <= 24) {
          this.ItemCart = await this._ApiService.addItemToCart(product_id, 1, action).then((res) => {
            return res;
          })

          if (this.ItemCart.code == 200) {
            this.getCartData();
            this.subtotal();
          }
        // }

        // else{
        //   this.disableIncreaseButton = true;
        // }
      }

      else {
        this.getCartData();
        this.subtotal();
      }
      // else {
      //   this.disableIncreaseButton = true;
      //   this.getCartData();
      // }
    }
  }

  cookies_data: any = [];
  deleteItemFromCart(product: any) {
    if (this.UserLogin != null) {
      this.CartShimmer = true;
      this._ApiService.deleteItemFromCart(product.product.id)
        .then((res) => {
          this.getCartData();
        })
        .catch((error) => {
          this.getCartData();
        })
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
  }

}

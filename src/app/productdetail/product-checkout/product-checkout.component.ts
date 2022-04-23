import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { CookieService } from 'ngx-cookie-service';
import { CookiesService } from 'src/app/Services/cookies.service';

@Component({
  selector: 'app-product-checkout',
  templateUrl: './product-checkout.component.html',
  styleUrls: ['./product-checkout.component.scss']
})
export class ProductCheckoutComponent implements OnInit {
  selectedPaymentMethod: any
  userObj: any;
  showDropdowm: boolean = false;
  getAllUserAddresses: any = [];
  CheckoutProduct: any = [];
  carts: any = [];
  orderObj: any;
  showPaypal: boolean = false;
  paypalProductDetails:any={};
  paymentCheck:boolean=true;
  shippingCharge: number = 500;
  public payPalConfig?: IPayPalConfig;
  constructor(private __apiservice: ApiServiceService, private route: Router, private _cookies: CookiesService) { }

  ngOnInit(): void {
    this.checkoutProduct();
    this.getPaypalProductDetail();
    this.initConfig();
    // this.getShippingInfo();
    if (localStorage.getItem('ecolink_user_credential') != null) {
      this.__apiservice.getUserAddress().subscribe((res: any) => {
        res.data.map((response: any) => {
          this.getAllUserAddresses.push(response);
          if (this.getAllUserAddresses.length > 0) {
            this.showDropdowm = true;
          }
        })
      });
    }
    // this.__apiservice.fedexshippingApi().subscribe(res=>{
    //   console.log(res);
    // })
  }
  getRadioButtonValue(value: any) {
    if (localStorage.getItem('ecolink_user_credential') != null) {
      console.log(value);
      console.log(this.getAllUserAddresses);
      this.CheckoutProduct[0].user = this.getAllUserAddresses[value];
    }
  }

  checkoutProduct() {
    if (localStorage.getItem('ecolink_user_credential') != null) {
      this.__apiservice.getCheckoutProducts().subscribe(res => {
        console.log(res);
        this.CheckoutProduct.push(res.data);
        console.log(this.CheckoutProduct);
      })
    }
    else {
      this.getsubjectBehaviour();
    }
  }

  // getShippingInfo() {
  //   this.__apiservice.rateDetailThroughSaia().subscribe(res => {
  //     console.log(res);
  //   })
  // }
  getOrderInfo() {
    this.orderObj = {
      sameAsShip: 0,
      order_amount: this.CheckoutProduct[0].order_total,
      product_discount: 0,
      coupon_discount: 0,
      total_amount: this.CheckoutProduct[0].payable,
      billing_name: this.CheckoutProduct[0].user.name,
      billing_email: this.CheckoutProduct[0].user.email,
      billing_mobile: this.CheckoutProduct[0].user.mobile,
      billing_address: this.CheckoutProduct[0].user.address,
      billing_landmark: this.CheckoutProduct[0].user.address,
      billing_country: this.CheckoutProduct[0].user.country,
      billing_state: this.CheckoutProduct[0].user.state,
      billing_city: this.CheckoutProduct[0].user.city,
      billing_zip: this.CheckoutProduct[0].user.pincode,
      shipping_name: this.CheckoutProduct[0].user.name,
      shipping_email: this.CheckoutProduct[0].user.email,
      shipping_mobile: this.CheckoutProduct[0].user.mobile,
      shipping_address: this.CheckoutProduct[0].user.address,
      shipping_landmark: this.CheckoutProduct[0].user.address,
      shipping_country: this.CheckoutProduct[0].user.country,
      shipping_state: this.CheckoutProduct[0].user.state,
      shipping_city: this.CheckoutProduct[0].user.city,
      shipping_zip: this.CheckoutProduct[0].user.pincode,
      payment_via: this.selectedPaymentMethod,
      shippment_via: 'saia',
      no_items: '1'
    }
    console.log(this.orderObj);
    this.__apiservice.storeOrder(this.orderObj).subscribe(res => {
      console.log(res);
    })
  }
  private initConfig(): void {
    this.payPalConfig = {
      currency: 'USD',
      clientId: 'AX8Dyud-bw5dJEEKvuTkv5DJBH89Ahs4yf8RagOrGwjaeDPs0quiWiQAN8wuoOZu-mByocZMmxeAzrS2',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: this.paypalProductDetails.payable,
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: this.paypalProductDetails.payable
              }
            }
          },
          items: [{
            name: 'Enterprise Subscription',
            quantity: '1',
            category: 'DIGITAL_GOODS',
            unit_amount: {
              currency_code: 'USD',
              value: this.paypalProductDetails.payable,
            },
          }]
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
        size: 'small',
        color: 'blue',
        shape: 'rect'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        if(data.status=='COMPLETED') {
          this.getOrderInfo();
          this.route.navigateByUrl('/thanks');
        }
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);

      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      }
    };
  }
  checkPaymentTab() {
    if(this.selectedPaymentMethod=='cod') {
      this.paymentCheck=false;
      console.log(this.paymentCheck);
    }
    else if(this.selectedPaymentMethod=="paypal") {
      this.paymentCheck=true;
      this.showPaypal = !this.showPaypal;
      console.log(this.paymentCheck);
    }
    else if (this.selectedPaymentMethod=="check-payment"){
      this.paymentCheck=false;
    }
  }
  cookiesCheckout: any = {}
  getsubjectBehaviour() {
    let cookiesObj: any = [];
    let data_obj: any = [];
    let completedFormat: any = {};
    cookiesObj = this._cookies.GetCartData();
    cookiesObj.map((res: any) => {
      this.__apiservice.getProductById(res.CartProductId).subscribe((resp: any) => {
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
        completedFormat.carts = data_obj;
      })
      this.cookiesCheckout.data = completedFormat;
    })
    setTimeout(() => {
      this.refractorData();
    }, 5000);
  }

  refractorData() {
    let user: any = {}
    user = {
      name: "",
      email: "",
      address: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
      mobile: ""
    }
    this.cookiesCheckout.data.user = user;
    this.cookiesCheckout.data.payable = localStorage.getItem('payable');
    this.CheckoutProduct.push(this.cookiesCheckout.data);
  }
  getPaypalProductDetail() {
    setTimeout(() => {
      this.CheckoutProduct.map((res: any) => {
        console.log(res.payable);
        this.paypalProductDetails.payable = res.payable;
        setTimeout(() => {
          console.log(this.paypalProductDetails);
        }, 1000);
      })
    }, 1000);
  }
}

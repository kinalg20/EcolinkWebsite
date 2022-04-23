import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';

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
  shippingCharge: number = 500;
  public payPalConfig?: IPayPalConfig;
  constructor(private __apiservice: ApiServiceService, private route: Router) { }

  ngOnInit(): void {
    this.initConfig();
    this.checkoutProduct();
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
      payment_via: 'paypal',
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
            value: '9.99',
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: '9.99'
              }
            }
          },
          items: [{
            name: 'Enterprise Subscription',
            quantity: '1',
            category: 'DIGITAL_GOODS',
            unit_amount: {
              currency_code: 'USD',
              value: '9.99',
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
    console.log(this.selectedPaymentMethod);
    if(this.selectedPaymentMethod == "paypal"){
      this.showPaypal = true;
    }
    else{
      this.showPaypal = false;      
    }
  }
  cookiesCheckout: any = {}
  getsubjectBehaviour() {
    this.__apiservice.cookiesCheckoutData.subscribe({
      next: (grca) => {
        if (grca.length > 0) {
          console.log(grca);
          this.carts = grca;
        }
        this.refractorData();
      }
    });
  }

  refractorData() {
    let data: any = {};
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
    data.user = user;
    data.carts = this.carts;
    data.payable = localStorage.getItem('payable')
    this.cookiesCheckout.data = data;
    console.log(this.cookiesCheckout.data);
    this.CheckoutProduct.push(this.cookiesCheckout.data);
  }
}

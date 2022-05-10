import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { CookiesService } from 'src/app/Services/cookies.service';
import { ShippingServiceService } from 'src/app/Services/shipping-service.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-product-checkout',
  templateUrl: './product-checkout.component.html',
  styleUrls: ['./product-checkout.component.scss']
})
export class ProductCheckoutComponent implements OnInit, AfterViewInit {
  selectedPaymentMethod: any
  userObj: any;
  discountCheck: boolean = true;
  disableOrderButton: boolean = true;
  couponCheck: boolean = false;
  rate: any;
  selectedShippingMethod : any;
  couponDiscount: any = 0;
  showDropdowm: boolean = false;
  getAllUserAddresses: any = [];
  CheckoutProduct: any = [];
  carts: any = [];
  pincode: any
  formShimmer: boolean = true;
  paypalItems: any = {}
  orderObj: any;
  showPaypal: boolean = false;
  paypalProductDetails: any = {};
  paypal: any = []
  taxCheck: boolean = false;
  paymentCheck: boolean = true;
  shippingCharge: number = 0;
  tax_exempt_user: number = 0
  checkoutShimmer: boolean = true;
  checkoutProductItem: any = {};
  public payPalConfig?: IPayPalConfig;
  constructor(private __apiservice: ApiServiceService,
    private route: Router,
    private _cookies: CookiesService,
    private _ShippingApi: ShippingServiceService,
    private router: Router) { }
  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    if (localStorage.getItem('ecolink_user_credential') == null) {
      this.discountCheck = false;
    }
    this.checkoutProduct();
    this.getTaxExempt()
    this.getPaypalProductDetail();
    this.initConfig();
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
    // this._ShippingApi.fedextokengeneration().subscribe((res: any) => {
    //   this._ShippingApi.fedexshippingApi(res.access_token, this.CheckoutProduct).subscribe((resp: any) => {
    //     console.log(resp);
    //     // console.log("resp.output", resp.output.rateReplyDetails[0].ratedShipmentDetails[0].totalNetCharge);
    //     // this.shippingCharge = resp.output.rateReplyDetails[0].ratedShipmentDetails[0].totalNetCharge;
    //   })
    // })
  }
  getTaxExempt() {
    this.__apiservice.getUserProfileDetail().subscribe((res: any) => {
      this.tax_exempt_user = res.data.tax_exempt;
    })
    setTimeout(() => {
      if (!this.tax_exempt_user) {
        this.taxCheck = true;
        this.__apiservice.getTaxForUser(this.pincode).subscribe((res: any) => {
          this.rate = res.data.rate;
          console.log(this.rate);
        })
      }
      else {
        console.log("false");
        this.taxCheck = false;
      }
    }, 1000);
  }
  routeToProfile() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/profile']);
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
        if (res.code == 200) {
          this.formShimmer = false;
          this.checkoutShimmer = false;
        }
        this.CheckoutProduct.push(res.data);
        res.data.addresses.map((res: any) => {
          this.pincode = res.zip;
        })
      })

      setTimeout(() => {
        this.getProduct();
      }, 1000);
    }
    else {
      this.getsubjectBehaviour();
    }
    this.CheckoutProduct.map((response: any) => {
      console.log(response.product.name)
      this.paypalItems.name = response.product.name;
      this.paypalItems.quantity = response.quantity;
      this.paypalItems.category = "PHYSICAL_GOODS";
      this.paypalItems.unit_amount = { currency_code: "USD", value: response.product.sale_price }
      this.paypal.push(this.paypalItems)
    })
  }

  product_weight: number = 0;
  product_width: number = 0;
  product_height: number = 0;
  product_length: number = 0;
  getProduct() {
    this.CheckoutProduct.map((res: any) => {
      console.log(res);
      res.carts.map((resp: any) => {
        this.product_weight = this.product_weight + resp.quantity * resp.product.weight;
        this.product_width = this.product_width + resp.quantity * resp.product.width;
        this.product_height = this.product_height + resp.quantity * resp.product.height;
        this.product_length = this.product_length + resp.quantity * resp.product.lenght;
      })
    })
    this.checkoutProductItem.weight = this.product_weight;
    this.checkoutProductItem.width = this.product_width;
    this.checkoutProductItem.height = this.product_height;
    this.checkoutProductItem.length = this.product_length;
    this.getShippingInfo();
  }

  saiaValues: any = {}
  getShippingInfo() {    
    this._ShippingApi.rateDetailThroughSaia(this.checkoutProductItem)
    .subscribe(
      (res: any) => {
        var parser = new DOMParser();
        let xmlDoc = parser.parseFromString(res, 'application/xml');
        console.log(xmlDoc);
        
        let firstEmployee = xmlDoc.getElementsByTagName('RateDetailItem')[0];
        console.log(firstEmployee);
        
        for (let i = 0; i < 4; i++) {
          let x = xmlDoc.getElementsByTagName(firstEmployee.childNodes[i].nodeName)[0];
          console.log("x", firstEmployee.childNodes[i].nodeName, x.childNodes[0].nodeValue);
          this.saiaValues[firstEmployee.childNodes[i].nodeName] = x.childNodes[0].nodeValue
        }
        console.log(this.saiaValues);
      },
      (error: HttpErrorResponse) => {
        if (true) {
          console.log(error.error);
        }
      }
      )
  }

  getOrderInfo() {
    let Extra_Charges : any;
    if(this.selectedShippingMethod == 'fedex'){
      Extra_Charges = this.shippingCharge + this.CheckoutProduct[0].payable;     
    }

    else{
      Extra_Charges = this.saiaValues.Amount + this.CheckoutProduct[0].payable;
      console.log(Extra_Charges);
    }
    this.orderObj = {
      sameAsShip: 0,
      order_amount: this.CheckoutProduct[0].order_total,
      product_discount: 0,
      coupon_discount: 0,
      total_amount: Extra_Charges,
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
      shippment_via: this.selectedShippingMethod,
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
          items: this.paypal
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
        if (data.status == 'COMPLETED') {
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
    if (this.selectedPaymentMethod == 'cod') {
      this.paymentCheck = false;
      console.log(this.paymentCheck);
    }
    else if (this.selectedPaymentMethod == "paypal") {
      this.paymentCheck = true;
      this.showPaypal = !this.showPaypal;
      console.log(this.paymentCheck);
    }
    else if (this.selectedPaymentMethod == "check-payment") {
      this.paymentCheck = false;
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
      this.formShimmer = false;
      this.checkoutShimmer = false
    }, 1000);
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
  payment: any;
  getPaypalProductDetail() {
    setTimeout(() => {
      this.CheckoutProduct.map((res: any) => {
        this.payment = res.payable + this.shippingCharge;
        console.log(this.payment)
        this.paypalProductDetails.payable = this.payment;
        setTimeout(() => {
          console.log(this.paypalProductDetails);
        }, 1000);
      })
    }, 1000);
  }
  couponButton() {
    this.discountCheck = false;
    this.couponCheck = true;
    this.CheckoutProduct.map((res: any) => {
      console.log(res);
      res.carts.map((response: any) => {
        this.couponDiscount += response.product.coupon_discount
        console.log(this.couponDiscount)
      })
    })
  }
  fillformevent(event: any) {
    this.disableOrderButton = event;
  }

  getShippingMethod(){
    console.log(this.selectedShippingMethod);
  }
}

import { AfterViewInit, Component, OnInit } from '@angular/core';
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
  selectedPaymentMethod: any;
  discountCheck: boolean = true;
  disableOrderButton: boolean = true;
  couponCheck: boolean = false;
  rate: number = 0;
  openAddressDropdown: boolean = false;
  selectedShippingMethod: string = 'fedex';
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
  taxCheck: boolean = true;
  paymentCheck: boolean = true;
  shippingCharge: number = 0;
  tax_exempt_user: number = 0
  checkoutShimmer: boolean = true;
  checkoutProductItem: any = {};
  public payPalConfig?: IPayPalConfig;
  shippingDataObj: any = {};
  billingUserDetail: any = {};
  fedexshippingboolean: boolean = true;
  saiashippingboolean: boolean = true;
  user_credential: any;
  verifiedUser: boolean = true;
  paymentMethod: boolean = false;
  constructor(private __apiservice: ApiServiceService,
    private route: Router,
    private _cookies: CookiesService,
    private _ShippingApi: ShippingServiceService,
    private router: Router) { }
  ngAfterViewInit(): void { }

  async ngOnInit() {
    this.user_credential = localStorage.getItem('ecolink_user_credential');
    if (localStorage.getItem('ecolink_user_credential') == null) {
      this.discountCheck = false;
    }
    await this.checkoutProduct();
    this.CheckoutProduct.map((res: any) => {
      if (res.carts.length == 0) {
        this.route.navigateByUrl('/cart');
      }
    })
    this.getPaypalProductDetail();
    this.initConfig();
    if (localStorage.getItem('ecolink_user_credential') != null) {
      await this.__apiservice.getUserAddress().
        then((res: any) => {
          res.data.map((response: any) => {
            this.getAllUserAddresses.push(response);
            if (this.getAllUserAddresses.length > 0) {
              this.showDropdowm = true;
            }
          })
        });
      this.FedexShippingObj();
    }
  }
  // get tax value 
  getTaxExempt() {
    if (localStorage.getItem('ecolink_user_credential') != null) {
      this.__apiservice.getUserProfileDetail().subscribe((res: any) => {
        this.tax_exempt_user = res.data.tax_exempt;
      })
      setTimeout(() => {
        if (!this.tax_exempt_user) {
          this.taxCheck = true;
          this.__apiservice.getTaxForUser(this.pincode).subscribe((res: any) => {
            this.rate = res.data.rate;
          })
        }
        else {
          console.log("false");
          this.taxCheck = false;
        }
      }, 1000);
    }
  }
  //route on profile page
  routeToProfile() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/profile']);
  }
  //get radio button value for addresses
  getRadioButtonValue(value: any) {
    if (localStorage.getItem('ecolink_user_credential') != null) {
      console.log(this.getAllUserAddresses);
      this.CheckoutProduct[0].user = this.getAllUserAddresses[value];
      this.shippingDataObj = this.getAllUserAddresses[value];
      console.log(this.shippingDataObj, this.getAllUserAddresses[value]);
      this.getProduct();
    }
  }
  //get product for billing
  dataFromLocation: any;
  async checkoutProduct() {
    if (localStorage.getItem('ecolink_user_credential') != null) {
      await this.__apiservice.getCheckoutProducts()
        .then(res => {
          console.log(res);
          if (res.code == 200) {
            this.formShimmer = false;
            this.checkoutShimmer = false;
          }
          this.CheckoutProduct.push(res.data);
          this.shippingDataObj = res.data.user;
          this.billingUserDetail = res.data.user;
          console.log(this.billingUserDetail);
          res.data.addresses.map((res: any) => {
            this.pincode = res.zip;
          })
        })

        .catch(error => {
          if (error.status == 400) {
            console.log(error.status);
          }
        })

      setTimeout(() => {
        console.log(this.shippingDataObj);
        this.getTaxExempt();
        this.getProduct();
      }, 1000);
    }
    else {
      if (localStorage.getItem('Address')) {
        this.dataFromLocation = localStorage.getItem('Address')
        this.dataFromLocation = JSON.parse(this.dataFromLocation)
      }
      this.getsubjectBehaviour();
    }
    this.CheckoutProduct.map((response: any) => {
      response.carts.map((resp: any) => {
        this.paypalItems.name = resp.product.name;
        this.paypalItems.quantity = resp.quantity;
        this.paypalItems.category = "PHYSICAL_GOODS";
        this.paypalItems.unit_amount = { currency_code: "USD", value: resp.product.sale_price }
        this.paypal.push(this.paypalItems)
      })
    })
  }


  async FedexShippingObj() {
    await this._ShippingApi.fedextokengeneration()
      .then((res: any) => {
        this._ShippingApi.fedexshippingApi(res.access_token, this.CheckoutProduct, this.shippingDataObj).subscribe((resp: any) => {
          console.log(resp.output.rateReplyDetails[0].ratedShipmentDetails[0].totalNetCharge);
          this.shippingCharge = resp.output.rateReplyDetails[0].ratedShipmentDetails[0].totalNetCharge;
        })
      })

<<<<<<< HEAD
      .catch((error: any) => {
=======
      .catch((error:any)=>{
>>>>>>> e440f1b643078bda9e91b04cf33324b063921ae8
        this.shippingCharge = 0;
      })
    if (this.shippingCharge > 0) {
      this.fedexshippingboolean = false;
    }
  }

  product_weight: number = 0;
  product_width: number = 0;
  product_height: number = 0;
  product_length: number = 0;

  // get shipping charges for product
  getProduct() {
    this.checkoutProductItem = [];
<<<<<<< HEAD
    console.log("this.CheckoutProduct", this.CheckoutProduct[0]);
    this.CheckoutProduct.map((res: any) => {
      console.log("res", res);
      res.carts.map((resp: any) => {
        console.log(resp);
        this.checkoutProductItem.weight = this.product_weight += (resp.quantity * resp.product.weight ? resp.product.weight : 1);
      })
    })
    this.checkoutProductItem.country = this.shippingDataObj.country ? this.shippingDataObj.country : this.dataFromLocation[6].long_name;
=======
    console.log("this.CheckoutProduct", this.CheckoutProduct);

    this.CheckoutProduct.map((res: any) => {
      console.log("res", res.carts);
        res.carts.map((resp: any) => {
          console.log(resp);
          this.checkoutProductItem.weight = this.product_weight += (resp.quantity * resp.product.weight ? resp.product.weight : 1);
        })
    })
    this.checkoutProductItem.country = this.shippingDataObj.country ? this.shippingDataObj.country : this.dataFromLocation[6].long_name ;
>>>>>>> e440f1b643078bda9e91b04cf33324b063921ae8
    this.checkoutProductItem.pincode = this.shippingDataObj.pincode ? this.shippingDataObj.pincode : this.shippingDataObj.zip ? this.shippingDataObj.zip : this.dataFromLocation[7].long_name;
    this.getShippingInfo();
  }




  saiaValues: any = {};
  saiaAmount: number = 0;
  // get product shipping info on checkout page
  getShippingInfo() {
    this._ShippingApi.rateDetailThroughSaia(this.checkoutProductItem)
      .subscribe(
        (res: any) => {
          var parser = new DOMParser();
          let xmlDoc = parser.parseFromString(res, 'application/xml');
          console.log(xmlDoc);

          let firstEmployee = xmlDoc.getElementsByTagName('RateDetailItem')[0];

          for (let i = 0; i < 4; i++) {
            let x = xmlDoc.getElementsByTagName(firstEmployee.childNodes[i].nodeName)[0];
            console.log("x", firstEmployee.childNodes[i].nodeName, x.childNodes[0].nodeValue);
            this.saiaValues[firstEmployee.childNodes[i].nodeName] = x.childNodes[0].nodeValue
          }
          console.log(this.saiaValues);
          this.saiashippingboolean = false;
          this.saiaAmount = Number(this.saiaValues.Amount);
        },
        (error: HttpErrorResponse) => {
          if (true) {
            console.log(error.error);
          }
        }
      )
  }
  //get total amount of product including taxes and shipping charges
  getOrderInfo() {
    console.log(this.billingUserDetail);
    let Extra_Charges: any;
    if (this.selectedShippingMethod == 'fedex') {
      Extra_Charges = this.shippingCharge + this.CheckoutProduct[0].payable;
    }

    else {
      let saiaAmount = Number(this.saiaValues.Amount);
      console.log(saiaAmount + this.CheckoutProduct[0].payable);
      Extra_Charges = saiaAmount + this.CheckoutProduct[0].payable;
    }
    this.orderObj = {
      sameAsShip: 0,
      order_amount: this.CheckoutProduct[0].order_total,
      product_discount: 0,
      coupon_discount: 0,
      total_amount: Extra_Charges,
      billing_name: this.billingUserDetail.name,
      billing_email: this.billingUserDetail.email,
      billing_mobile: this.billingUserDetail.mobile,
      billing_address: this.billingUserDetail.address,
      billing_landmark: this.billingUserDetail.address,
      billing_country: this.billingUserDetail.country,
      billing_state: this.billingUserDetail.state,
      billing_city: this.billingUserDetail.city,
      billing_zip: this.billingUserDetail.pincode,
      shipping_name: this.shippingDataObj.name,
      shipping_email: this.shippingDataObj.email,
      shipping_mobile: this.shippingDataObj.mobile,
      shipping_address: this.shippingDataObj.address,
      shipping_landmark: this.shippingDataObj.landmark ? this.shippingDataObj.landmark : this.shippingDataObj.city,
      shipping_country: this.shippingDataObj.country,
      shipping_state: this.shippingDataObj.state,
      shipping_city: this.shippingDataObj.city,
      shipping_zip: this.shippingDataObj.zip ? this.shippingDataObj.zip : this.shippingDataObj.pincode,
      payment_via: this.selectedPaymentMethod,
      shippment_via: this.selectedShippingMethod,
      no_items: '1'
    }
    console.log(this.orderObj);
    this.__apiservice.storeOrder(this.orderObj).subscribe((res: any) => {
      console.log(res);
    });
  }
  // dynamic paypal binding and integration
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
        else {
          this.route.navigateByUrl('failed');
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
  // enable and disable payment tabs
  checkPaymentTab() {
    this.paymentMethod = true;
    if (this.selectedPaymentMethod == 'cod') {
      this.paymentCheck = false;
      this.showPaypal = false;
      console.log(this.paymentCheck);
    }
    else if (this.selectedPaymentMethod == "paypal") {
      this.paymentCheck = true;
      this.showPaypal = true;
      console.log(this.paymentCheck);
    }

    let verification = JSON.parse(this.user_credential);
    if (verification.user?.email_verified == 0) {
      this.verifiedUser = false;
      console.log(this.verifiedUser);
    }
  }
  cookiesCheckout: any = {}
  //get cookies data on cart
  getsubjectBehaviour() {
    let cookiesObj: any = [];
    let data_obj: any = [];
    let completedFormat: any = {};
    cookiesObj = this._cookies.GetCartData();
    if (cookiesObj.length > 0) {
      cookiesObj.map((res: any) => {
        this.__apiservice.getProductById(res.CartProductId).subscribe((resp: any) => {
          console.log("resp", resp);
          let data: any = {};
          let products: any = {};
          data.quantity = res.ProductQuantity;
          data.product_id = resp.data.id;
          products.id = res.CartProductId;
          products.name = resp.data.name;
          products.sale_price = resp.data.sale_price;
          products.width = resp.data.width;
          products.height = resp.data.height;
          products.lenght = resp.data.lenght;
          products.weight = resp.data.weight;
          products.image = resp.data.image;
          products.alt = resp.data.alt;
          data.product = products;
          data_obj.push(data);
          completedFormat.carts = data_obj;
        })
        this.cookiesCheckout.data = completedFormat;
<<<<<<< HEAD
        console.log(this.cookiesCheckout);

=======
>>>>>>> e440f1b643078bda9e91b04cf33324b063921ae8
      })
      setTimeout(() => {
        this.refractorData();
        this.formShimmer = false;
        this.checkoutShimmer = false;
      }, 1000);
    }
    else {
      this.route.navigateByUrl('/cart');
    }
  }
<<<<<<< HEAD
  async refractorData() {
    console.log(this.cookiesCheckout);
=======
  refractorData() {
    console.log(this.dataFromLocation);
>>>>>>> e440f1b643078bda9e91b04cf33324b063921ae8
    let user: any = {};
    user = {
      name: "",
      email: "",
<<<<<<< HEAD
      address: this.dataFromLocation ? this.dataFromLocation[4].long_name ? this.dataFromLocation[4].long_name : "" : "",
      city: this.dataFromLocation ? this.dataFromLocation[3].long_name ? this.dataFromLocation[3].long_name : "" : "",
      state: this.dataFromLocation ? this.dataFromLocation[5].long_name ? this.dataFromLocation[5].long_name : "" : "",
      country: this.dataFromLocation ? this.dataFromLocation[6].long_name ? this.dataFromLocation[6].long_name : "" : "",
      pincode: this.dataFromLocation ? this.dataFromLocation[7].long_name ? this.dataFromLocation[7].long_name : "" : "",
      mobile: ""
    }
    console.log(user);
    this.cookiesCheckout.data.user = user;
    this.cookiesCheckout.data.payable = localStorage.getItem('payable');
    console.log(this.cookiesCheckout, "this.cookiesCheckout");
    let product_data = [];
    await product_data.push(this.cookiesCheckout.data);
    console.log(product_data, "product_data");
    this.CheckoutProduct = product_data;
=======
      address: this.dataFromLocation ? this.dataFromLocation[4]?.long_name : "",
      city: this.dataFromLocation ? this.dataFromLocation[3]?.long_name : "",
      state: this.dataFromLocation ? this.dataFromLocation[5]?.long_name : "",
      country: this.dataFromLocation ? this.dataFromLocation[6]?.long_name : "",
      pincode: this.dataFromLocation ? this.dataFromLocation[7]?.long_name : "",
      mobile: ""
    }

    console.log(user);

    this.cookiesCheckout.data.user = user;
    this.cookiesCheckout.data.payable = localStorage.getItem('payable');
    this.CheckoutProduct.push(this.cookiesCheckout.data);
>>>>>>> e440f1b643078bda9e91b04cf33324b063921ae8
    // this.getTaxExempt();
    this.FedexShippingObj();
    this.getProduct();
  }

  //collect product information to send paypal
  payment: any;
  getPaypalProductDetail() {
    setTimeout(() => {
      this.CheckoutProduct.map((res: any) => {
        this.payment = res.payable + this.shippingCharge;
        // console.log(this.payment)
        this.paypalProductDetails.payable = this.payment;
        setTimeout(() => {
          // console.log(this.paypalProductDetails);
        }, 1000);
      })
    }, 1000);
  }
  // get coupon discount on product
  couponButton() {
    this.discountCheck = false;
    this.couponCheck = true;
    this.CheckoutProduct.map((res: any) => {
      console.log(res);
      res.carts.map((response: any) => {
        this.couponDiscount += response.product.coupon_discount
      })
    })
  }
  fillformevent(event: any) {
    this.disableOrderButton = event;
  }
  getShippingMethod() {
    console.log(this.selectedShippingMethod);
  }
  getshippingInfo(event: any) {
    console.log(event);
    this.shippingDataObj = event;
  }
}

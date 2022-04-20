import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
@Component({
  selector: 'app-billing-form',
  templateUrl: './billing-form.component.html',
  styleUrls: ['./billing-form.component.scss']
})
export class BillingFormComponent implements OnInit {
  @Input() CheckoutProduct: any;
  userObj: any;
  public payPalConfig ? : IPayPalConfig;
  constructor(private __apiservice: ApiServiceService, private route: Router) { }

  ngOnInit(): void {
    this.initConfig();
  }
  signUp(form: NgForm) {
    if (form.valid) {
      let data = Object.assign({}, form.value);
      this.userObj = {
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        password: data.email,
        address: data.streetaddress,
        country: data.countryname,
        state: data.state,
        city: data.city,
        pincode: data.pincode
      };
      console.log(this.userObj);
      if (localStorage.getItem('ecolink-user-credential') == null) {
        this.__apiservice.post(this.userObj).subscribe(
          (res) => {
            console.log(res);
            if (res.code == 200) {
              localStorage.setItem(
                'ecolink_user_credential',
                JSON.stringify(res.data)
              );
              this.route.navigateByUrl('/shop/checkout');
            }
            else {
              localStorage.removeItem('ecolink_user_credential');
            }
          },
        );
      }
    }
  }

  private initConfig(): void {
    this.payPalConfig = {
        currency: 'USD',
        clientId: 'AX8Dyud-bw5dJEEKvuTkv5DJBH89Ahs4yf8RagOrGwjaeDPs0quiWiQAN8wuoOZu-mByocZMmxeAzrS2',
        createOrderOnClient: (data) => < ICreateOrderRequest > {
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
            actions.order.get().then((details:any) => {
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


}

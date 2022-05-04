import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { CookiesService } from 'src/app/Services/cookies.service';
@Component({
  selector: 'app-billing-form',
  templateUrl: './billing-form.component.html',
  styleUrls: ['./billing-form.component.scss']
})
export class BillingFormComponent implements OnInit {
  @Input() CheckoutProduct: any;
  @Input() formShimmer: boolean = true;
  @Output() FormFillUp = new EventEmitter<boolean>();
  userObj: any;
  invalidUserEmail: string = '';
  resSignupMsg: string = '';
  resSignupMsgCheck: string = ' '; 
  invalidMobile = false;
  invalidEmail: boolean = false;
  password: string = '';
  confirm_password: string = ''
  UserLogin: any;
  constructor(private __apiservice: ApiServiceService, private route: Router, private _cookies: CookiesService) { }

  ngOnInit(): void {
    console.log(this.formShimmer);
    this.UserLogin = localStorage.getItem('ecolink_user_credential');
  }
  signUp(form: NgForm) {
    if (form.valid) {
      let data = Object.assign({}, form.value);
      console.log(data);
      this.userObj = {
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        password: this.password,
        address: data.streetaddress,
        country: data.countryname,
        state: data.state,
        city: data.city,
        pincode: data.pincode
      };
      if (!localStorage.getItem('ecolink_user_credential')) {
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
        this.SaveCookiesDataInCart();
      }
      else {
        console.log('getuseraddress');
        this.FormFillUp.emit(false);
      }
    }
    else {
      this.resSignupMsg = 'Please fill the form';
    }
  }
  validateUserEmail(email: any) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email.target.value) == false) {
      this.invalidUserEmail = 'Invalid Email Address';
      return false;
    }
    this.invalidUserEmail = '';
    return true;
  }
  validateEmail(event: any) {
    const value = event.target.value;

    if (
      value &&
      !/^[0-9]*$/.test(value) &&
      !this.validateUserEmail(event)
    ) {
      this.invalidEmail = true;
    }

    else {
      this.invalidEmail = false;
    }
  }
  SaveCookiesDataInCart() {
    setTimeout(() => {
      this.CheckoutProduct.map((res: any) => {
        console.log(res.carts);
        res.carts.map((resp: any) => {
          console.log(resp);
          this.__apiservice.addItemToCart(resp.product_id, resp.quantity, "add").subscribe(res =>
            console.log(res));
          if (res.code == 200) {
            this._cookies.DeleteCartData();
          }
        })
      })
      this.FormFillUp.emit(false);
    }, 1000);
  }
  inputMobile(event: any) {
    if (
      event.key.length === 1 &&
      !/^[0-9]$/.test(event.key)
    ) {
      event.preventDefault();
    }
  }
  validateMobile(event: any) {
    const value = event.target.value;

    if (
      value &&
      /^[0-9]+$/.test(value) &&
      value.length < 10
    ) {
      this.invalidMobile = true;
    }

    else {
      this.invalidMobile = false;
    }
  }


}

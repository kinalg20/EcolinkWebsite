import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
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
  @Output() OrderInfo = new EventEmitter<boolean>();
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
    if (this.UserLogin) {
      this.FormFillUp.emit(false);
    }

    else {
      this.FormFillUp.emit(true);
    }
  }
  // signup when user come to checkout without login
  signUp(form: NgForm) {
    if (form.valid) {
      let data = Object.assign({}, form.value);
      console.log(data.radio2);
      this.userObj = {
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        password: this.password,
        address: data.streetaddress,
        country: data.countryname,
        state: data.state,
        city: data.city,
        pincode: data.pincode,
        tax_exempt: Number(data.radio2)
      };

      console.log("this.userObj", this.userObj);
      if (!localStorage.getItem('ecolink_user_credential')) {
        this.__apiservice.post(this.userObj).subscribe(
          (res) => {
            console.log(res);
            if (res.code == 200) {
              this.OrderInfo.emit(this.userObj)
              window.scroll(0, 0)
              this.resSignupMsg = "Verification mail has been sent to your Email Id !";
              this.resSignupMsgCheck = 'success'
              localStorage.setItem(
                'ecolink_user_credential',
                JSON.stringify(res.data));
              this.route.navigateByUrl('/shop/checkout');
              this.SaveCookiesDataInCart();
            }
            else {
              localStorage.removeItem('ecolink_user_credential');
            }
          },
          (error: HttpErrorResponse) => {
            window.scroll(0, 0)
            if (error.error.code == 400) {
              if (error.error.message.email) {
                this.resSignupMsg = error.error.message.email;
              }
              if (error.error.message.password) {
                this.resSignupMsg = error.error.message.password;
              }
              if (error.error.message.mobile) {
                this.resSignupMsg = error.error.message.mobile;
              }
              if (error.error.message.tax_exempt) {
                this.resSignupMsg = error.error.message.tax_exempt;
              }
              this.resSignupMsgCheck = 'danger';
            }
          });
      }
      else {
        console.log("Select Address");
      }
    }
    else {
      this.resSignupMsg = 'Please fill the form';
      this.resSignupMsgCheck = 'danger';
      window.scroll(0, 0);
    }
  }
  //validate user email
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
  //store cookies data in cart on checkout page
  SaveCookiesDataInCart() {
    this.CheckoutProduct.map((res: any) => {
      console.log(res.carts);
      res.carts.map(async (resp: any) => {
        console.log(resp);
        await this.__apiservice.addItemToCart(resp.product_id, resp.quantity, "add")
          .then((res) => {
            console.log(res);
            this._cookies.DeleteCartData();
          })

          .catch((error: any) => {
            console.log(error);

          })
      })
    })
    this.FormFillUp.emit(false);
  }
  //validate user mobile number 
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
  //add user address for shipping
  addUserAddress(form: NgForm) {
    if (form.valid) {
      let data = Object.assign({}, form.value);
      this.userObj = {
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        landmark: data.landmark,
        address: data.streetaddress,
        country: data.countryname,
        state: data.state,
        city: data.city,
        zip: data.pincode
      };
      console.log(this.userObj);
      this.__apiservice.addUserAddresses(this.userObj).subscribe(
        (res) => {
          console.log(res);
          if (res.code == 200) {
            this.FormFillUp.emit(false);
            this.OrderInfo.emit(this.userObj);
            this.resSignupMsgCheck = 'success';
            this.resSignupMsg = res.message;
            window.scroll(0, 0)
            this.route.routeReuseStrategy.shouldReuseRoute = () => false;
            this.route.navigate(['/shop/checkout']);
          }
        },

        (error: HttpErrorResponse) => {
          window.scroll(0, 0)
          if (error.error.code == 400) {
            if (error.error.message.email) {
              this.resSignupMsg = error.error.message.email;
            }
            if (error.error.message.password) {
              this.resSignupMsg = error.error.message.password;
            }
            if (error.error.message.mobile) {
              this.resSignupMsg = error.error.message.mobile;
            }
            if (error.error.message.landmark) {
              this.resSignupMsg = error.error.message.landmark;
            }
            this.resSignupMsgCheck = 'danger';
          }
        });
      () => {
        form.reset();
      }
    }
    else {
      this.resSignupMsgCheck = 'danger';
      this.resSignupMsg = 'Please Fill the Fields Below!';
    }

  }
  //close pop up
  close() {
    this.resSignupMsg = '';
  }

}

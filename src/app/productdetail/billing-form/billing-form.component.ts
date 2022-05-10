import { HttpErrorResponse } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
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
  userObj: any;
  invalidUserEmail: string = '';
  resSignupMsg: string = '';
  resSignupMsgCheck: string = ' ';
  invalidMobile = false;
  invalidEmail: boolean = false;
  password: string = '';
  confirm_password: string = ''
  UserLogin: any;
  constructor(private __apiservice: ApiServiceService, private renderer: Renderer2, private route: Router, private _cookies: CookiesService) { }

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
        pincode: data.pincode,
        tax_exempt: data.tax_exempt
      };
      if (!localStorage.getItem('ecolink_user_credential')) {
        this.__apiservice.post(this.userObj).subscribe(
          (res) => {
            console.log(res);
            if (res.code == 200) {
              window.scroll(0, 0)
              this.resSignupMsg = res.message;
              this.resSignupMsgCheck = 'success'
              localStorage.setItem(
                'ecolink_user_credential',
                JSON.stringify(res.data)
              );
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
        this.addUserAddress(form);
        this.FormFillUp.emit(false);
      }
    }
    else {
      this.resSignupMsg = 'Please fill the form';
      this.resSignupMsgCheck = 'danger';
      window.scroll(0, 0);
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
          this.__apiservice.addItemToCart(resp.product_id, resp.quantity, "add");
          // this.__apiservice.addItemToCart(resp.product_id, resp.quantity, "add").subscribe(res =>
          //   console.log(res));
          // if (res.code == 200) {
          //   this._cookies.DeleteCartData();
          // }

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
            this.resSignupMsgCheck = 'success';
            this.resSignupMsg = res.message;
            window.scroll(0, 0)
            this.route.routeReuseStrategy.shouldReuseRoute = () => false;
            // this.route.onSameUrlNavigation = 'reload';
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

  close() {
    this.resSignupMsg = '';
  }

}

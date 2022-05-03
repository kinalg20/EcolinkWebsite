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
  resSignupMsg: any;
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



}

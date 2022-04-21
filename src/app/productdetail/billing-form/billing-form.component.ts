import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';
@Component({
  selector: 'app-billing-form',
  templateUrl: './billing-form.component.html',
  styleUrls: ['./billing-form.component.scss']
})
export class BillingFormComponent implements OnInit {
  @Input() CheckoutProduct: any;
  userObj: any;
  resSignupMsg: any;
  constructor(private __apiservice: ApiServiceService, private route: Router) { }

  ngOnInit(): void {
    console.log(this.CheckoutProduct);
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
      if ('ecolink-user-credential' in localStorage) {
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
      else {
        console.log('getuseraddress');
      }
    }
    else {
      this.resSignupMsg = 'Please fill the value';
    }
  }



}

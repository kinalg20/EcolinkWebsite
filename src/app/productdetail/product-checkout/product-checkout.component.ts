import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';

@Component({
  selector: 'app-product-checkout',
  templateUrl: './product-checkout.component.html',
  styleUrls: ['./product-checkout.component.scss']
})
export class ProductCheckoutComponent implements OnInit {
  selectedPaymentMethod:any
  userObj: any;
  constructor(private __apiservice:ApiServiceService,private route:Router) { }

  ngOnInit(): void {
  }
  signUp(form: NgForm) {
    if (form.valid) {
      let data = Object.assign({}, form.value);
      this.userObj = {
        name: data.firstname+ ' ' + data.lastname,
        email: data.email,
        mobile: data.mobile,
        password: data.email,
        address: data.address,
        country: data.selectedoption,
        state: data.country,
        city: data.city,
        pincode: data.pincode
      };
      console.log(this.userObj);
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
        () => {
          form.reset();
        }
      );
    }
  }
}

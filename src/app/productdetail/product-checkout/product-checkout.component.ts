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
  selectedPaymentMethod: any
  userObj: any;
  showDropdowm: boolean = false;
  getAllUserAddresses: any = [];
  CheckoutProduct: any = [];
  constructor(private __apiservice: ApiServiceService, private route: Router) { }

  ngOnInit(): void {
    this.checkoutProduct();
    this.__apiservice.getUserAddress().subscribe((res: any) => {
      res.data.map((response: any) => {
        this.getAllUserAddresses.push(response);
        if (this.getAllUserAddresses.length > 0) {
          this.showDropdowm = true;
        }
      })
    });
  }
  getRadioButtonValue(value:any) {
    console.log(this.getAllUserAddresses[value]);
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

  checkoutProduct() {
    this.__apiservice.getCheckoutProducts().subscribe(res => {
      console.log(res);
      this.CheckoutProduct.push(res.data);
    })
    setTimeout(() => {
    console.log(this.CheckoutProduct[0]);
    }, 5000);
    this.__apiservice.getItemFromCart().subscribe(res => {
      console.log(res);
    })
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';
@Component({
  selector: 'app-profile-dashboard',
  templateUrl: './profile-dashboard.component.html',
  styleUrls: ['./profile-dashboard.component.scss']
})
export class ProfileDashboardComponent implements OnInit {
  resSignupMsg: string = '';
  userObj: any;
  invalidUserEmail: string = '';
  invalidEmail: boolean = false;
  invalidMobile = false;
  @Input() showdesc: any;
  userAddress: any;
  constructor(private __apiservice: ApiServiceService, private router: Router) {
  }

  ngOnInit(): void {
    this.__apiservice.getUserAddress().subscribe((res: any) => {
      this.userAddress = res.data
      console.log(res);
    })
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
        name: data.firstname + ' ' + data.lastname,
        email: data.email,
        mobile: data.phonenumber,
        landmark: data.landmark,
        address: data.address,
        country: data.country,
        state: data.state,
        city: data.city,
        zip: data.pincode
      };
      console.log(this.userObj);
      this.__apiservice.addUserAddresses(this.userObj).subscribe(
        (res) => {
          console.log(res);
          // if (res.code == 200) {
          //   localStorage.setItem(
          //     'ecolink_user_credential',
          //     JSON.stringify(res.data)
          //   );
          //   this.router.navigateByUrl('/profile');
          // }

          // else {
          //   this.resSignupMsg = res.message;
          //   localStorage.removeItem('ecolink_user_credential');
          // }
        },
        () => {
          form.reset();
        }
      );
    }
    else {
      console.log("empty");
      this.resSignupMsg = 'Please fill the value';
    }


  }
  resetValue(form:NgForm){
    form.reset()
    this.resSignupMsg='';
  }
}

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
  profileAddress: any = [];
  addORedit: boolean = false;
  userObj: any;
  userDetail: any = [];
  invalidUserEmail: string = '';
  invalidEmail: boolean = false;
  invalidMobile = false;
  addressObject: any = {};
  allUserAddresses: any = [];
  @Input() showdesc: any;
  constructor(private __apiservice: ApiServiceService, private router: Router) {
  }

  ngOnInit(): void {
    this.__apiservice.getUserProfileDetail().subscribe((res: any) => {
      this.userDetail.push(res.data);
      console.log(this.userDetail);
      this.addressObject.name = res.data.name;
      this.addressObject.email = res.data.email;
      this.addressObject.mobile = res.data.mobile;
      this.addressObject.address = res.data.address;
      this.addressObject.country = res.data.country;
      this.addressObject.state = res.data.state;
      this.addressObject.city = res.data.city;
      this.addressObject.zip = res.data.pincode;
      this.addressObject.landmark = '';
    })
    // this.allUserAddresses.push(this.addressObject);
    this.__apiservice.getUserAddress().subscribe((res: any) => {
      res.data.map((response: any) => {
        this.allUserAddresses.push(response);
      })
    })
    setTimeout(() => {
      console.log(this.allUserAddresses);
    }, 1000);
    console.log(this.allUserAddresses);
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
        zip: data.pincode,
      };
      console.log(this.userObj);
      this.profileAddress.map((res: any) => {
        if (res.heading == 'Add Address') {
          this.__apiservice.addUserAddresses(this.userObj).subscribe(
            (res) => {
              console.log(res);
              window.location.reload();
            },
            () => {
              form.reset();
            }
          );
        }
        else {
          console.log('edit');
          this.userObj.address_id = data.id;
          this.__apiservice.editUserAddress(this.userObj).subscribe((res: any) => {
            console.log(res);
            window.location.reload();
          },
            () => {
              form.reset();
            }
          );
        }
      })
    }
    else {
      this.resSignupMsg = 'Please fill the value';
    }


  }
  resetValue(form: NgForm) {
    this.resSignupMsg = '';
  }
  deleteUserAddress(item_id: any) {
    console.log(item_id);
    this.__apiservice.deleteUserAddress(item_id).subscribe((res: any) => {
      window.location.reload();
    })
  }

  getUserDetail(item: any) {
    if (item == 'add') {
      this.profileAddress = [];
      this.profileAddress.push({ heading: "Add Address" })
    }
    else {
      this.profileAddress = [];
      item.heading = "Edit Address";
      item.firstname = item.name.split(" ")[0];
      item.lastname = item.name.split(" ")[1];
      this.profileAddress.push(item);
    }
  }
}

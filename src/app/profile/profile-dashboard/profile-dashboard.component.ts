import {
  Component, Input, OnInit, Renderer2, AfterViewInit, ViewChild, ElementRef
} from '@angular/core';
import { ViewportScroller } from "@angular/common";
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-profile-dashboard',
  templateUrl: './profile-dashboard.component.html',
  styleUrls: ['./profile-dashboard.component.scss']
})
export class ProfileDashboardComponent implements OnInit {
  @ViewChild('test') test: ElementRef | any;
  resSignupMsg: string = '';
  profileAddress: any = [];
  addORedit: boolean = false;
  userObj: any;
  userDetail: any = [];
  invalidUserEmail: string = '';
  invalidEmail: boolean = false;
  invalidMobile = false;
  allUserAddresses: any = [];
  orderData: any = [];
  orderHistoryDesc: any = [];
  storeObj: any;
  passwrodCheck: boolean = false
  userObj1: any = []
  show: boolean = true;
  resSignupMsgCheck: string = ' ';
  // showDetails: boolean=true;
  @Input() showdesc: any;
  constructor(private __apiservice: ApiServiceService, private scroller: ViewportScroller, private renderer: Renderer2, private router: Router) {
  }

  ngOnInit(): void {
    this.__apiservice.getUserProfileDetail().subscribe((res: any) => {
      this.userDetail.push(res.data);
      this.userDetail.map((res: any) => {
        setTimeout(() => {
          res.firstname = res.name.split(" ")[0]
          res.lastname = res.name.split(" ")[1]
          console.log(res);
        }, 1000);
      })
      console.log(this.userDetail);
    })
    this.getAllUserAddress()
    this.getOrderhistory();
    this.getReturnProduct();
  }

  getAllUserAddress() {
    this.__apiservice.getUserAddress().subscribe((res: any) => {
      this.allUserAddresses = [];
      console.log(res);
      res.data.map((response: any) => {
        this.allUserAddresses.push(response);
      })
      setTimeout(() => {
        console.log(this.allUserAddresses);
      }, 1000);
    })
  }
  changePassword() {
    this.passwrodCheck = !this.passwrodCheck;
    console.log()
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
              this.resSignupMsg = 'Profile Edited Successfully!';
              this.resSignupMsgCheck = 'success';
            }
          );
        }
      })
    }
    else {
      this.resSignupMsgCheck = 'danger';
      this.resSignupMsg = 'Please Fill the Fields Below!';
    }

  }
  resetValue(form: NgForm) {
    this.resSignupMsg = '';
  }
  deleteUserAddress(item_id: any) {
    console.log(item_id);
    this.__apiservice.deleteUserAddress(item_id).subscribe((res: any) => {
      if (res.code == 200) {
        this.resSignupMsg = 'Your Address Deleted Successfully!';
        this.resSignupMsgCheck = 'success';
        this.getAllUserAddress();
      }
      // window.location.reload();
    },
      (error: HttpErrorResponse) => {
        if (error.error.code == 400) {
          this.allUserAddresses = []
          this.getAllUserAddress();
        }
        console.log(error.error.code);
      }
    )
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
  getOrderhistory() {
    this.__apiservice.getOrderData().subscribe((res: any) => {
      setTimeout(() => {
        console.log("oderhistory", res);
        this.orderData = res;
      }, 1000);
    })
  }
  storeReturnProduct(i: any) {
    console.log(i)
    this.storeObj = {
      order_id: i.order_id,
      order_item_id: i.id,
      product_id: i.product_id,
      quantity: i.quantity,
      reason: "Accidentally Placed Order",
      description: "test"
    }
    this.__apiservice.storeReturnOrder(this.storeObj).subscribe(res => {
      console.log(res)
    })
  }
  getReturnProduct() {
    //  this.orderData.data[0].user_id
    //  console.log(this.orderData.data[0].user_id)
    this.__apiservice.getReturnOrder().subscribe(res => {
      setTimeout(() => {
        console.log("returndata", res)
      }, 1000);
    })
  }
  editUserProfile(form: NgForm) {
    if (!(this.passwrodCheck)) {
      if (form.valid) {
        let data = Object.assign({}, form.value);
        this.userObj = {
          name: data.firstname + ' ' + data.lastname,
          email: data.email,
          mobile: data.phonenumber,
          address: data.address,
          country: data.country,
          state: data.state,
          city: data.city,
          pincode: data.pincode
        };
        console.log(this.userObj);
        this.__apiservice.editUserProfileInfo(this.userObj).subscribe((res: any) => {
          console.log(res);
          form.reset();
          this.resSignupMsg = 'Profile Edited Successfully!';
          this.resSignupMsgCheck = 'success';
        }
        )
      }
      else {
        this.resSignupMsgCheck = 'danger';
        this.resSignupMsg = 'Please Fill the Fields Below!';
      }
    }
    else {
      if (form.valid) {
        let data = Object.assign({}, form.value);
        this.userObj1 = {
          email: data.email,
          password: data.password,
          password_confirmation: data.password
        };
        this.userObj = {
          name: data.firstname + ' ' + data.lastname,
          email: data.email,
          mobile: data.phonenumber,
          address: data.address,
          country: data.country,
          state: data.state,
          city: data.city,
          pincode: data.pincode
        };
        console.log(this.userObj);
        this.__apiservice.forgotPassword(this.userObj1).subscribe((res: any) => {
          console.log(res);
          form.reset();
        })
        this.__apiservice.editUserProfileInfo(this.userObj).subscribe((res: any) => {
          console.log(res);
          form.reset();
        })
      }
      else {
        this.resSignupMsg = 'Please fill the value';
      }
    }
  }
  ngAfterViewInit() { }
  close() {
    this.renderer.setStyle(this.test.nativeElement, 'display', 'none');
    this.resSignupMsg = '';
  }
  goToTop() {
    window.scrollTo(0, 0);
    this.scroller.scrollToAnchor("backToTop");
  }
  changeTab() {
    this.showdesc = 'Edit Profile';
  }
  showDeatils(i: any) {
    this.orderHistoryDesc = [];
    this.orderHistoryDesc.push(i)
    console.log(this.orderHistoryDesc)
    this.show = !this.show;
  }
}

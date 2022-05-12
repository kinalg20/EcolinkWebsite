import {
  Component, Input, OnInit, Renderer2, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter
} from '@angular/core';
import { ViewportScroller } from "@angular/common";
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
@Component({
  selector: 'app-profile-dashboard',
  templateUrl: './profile-dashboard.component.html',
  styleUrls: ['./profile-dashboard.component.scss']
})
export class ProfileDashboardComponent implements OnInit {
  @ViewChild('test') test: ElementRef | any;
  @Output() itemEvent = new EventEmitter<any>();
  searchItem: string = '';
  shimmerLoad: boolean = true;
  tabCheck: boolean = true
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
  searchProductArray: any = [];
  storeObj: any;
  passwrodCheck: boolean = false
  userObj1: any = []
  show: boolean = true;
  resEditProfileMsg: string = '';
  resEditProfileMsgCheck: string = '';
  resSignupMsg: string = '';
  resSignupMsgCheck: string = ' ';
  resAddmsg: string = ' ';
  resAddmsgCheck: string = ' ';
  suggestions: boolean = false;
  order: any = [];
  @Input() showdesc: any;
  constructor(private __apiservice: ApiServiceService, private scroller: ViewportScroller, private renderer: Renderer2, private router: Router) {
  }

  ngOnInit(): void {
    this.getFunction();

    this.getAllUserAddress()
    this.getOrderhistory();
    this.getReturnProduct();
  }
  getFunction() {
    this.userDetail = []
    this.__apiservice.getUserProfileDetail().subscribe((res: any) => {
      this.userDetail.push(res.data);
      this.shimmerLoad = false;
      this.userDetail.map((res: any) => {
        setTimeout(() => {
          res.firstname = res.name.split(" ")[0]
          res.lastname = res.name.split(" ")[1]
          console.log("res", res);
        }, 1000);
      })
      console.log(this.userDetail);
    })
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
              this.router.routeReuseStrategy.shouldReuseRoute = () => false;
              this.router.onSameUrlNavigation = 'reload';
              this.router.navigate(['/' + 'profile']);
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
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
              this.router.onSameUrlNavigation = 'reload';
              this.router.navigate(['/' + 'profile']);
          },
            () => {
              form.reset();
              // this.resAddmsg = 'Profile Edited Successfully!';
              // this.resAddmsgCheck = 'success';
            }
          );
        }
      })
    }
    else {
      this.resAddmsg = 'Please Fill the Fields Below!';
      this.resAddmsgCheck = 'danger';
      setTimeout(() => {
        this.resAddmsg=''
      }, 2000);
    }

  }
  resetValue(form: NgForm) {
    this.resSignupMsg = '';
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
  getOrderhistory() {
    let product_search: any;
    this.__apiservice.getOrderData().subscribe((res: any) => {
      setTimeout(() => {
        this.orderData = res.data;
        this.order = res.data;
        console.log(this.orderData);
        res.data.map((resp: any) => {
          resp.items.map((response: any) => {
            product_search = response.product;
          })
          this.searchProductArray.push(product_search);
        })
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
    this.__apiservice.getReturnOrder().subscribe(res => {
      setTimeout(() => {
        console.log("returndata", res)
      }, 1000);
    })
  }

  header: any;
  editUserProfile(form: NgForm) {
    if (!(this.passwrodCheck)) {
      if (form.valid) {
        let formData1 = new FormData();
        let data = Object.assign({}, form.value);
        this.header = localStorage.getItem('ecolink_user_credential');
        let user_id = JSON.parse(this.header).user_id;
        formData1.append('profile_image', this.file);
        formData1.append('name', data.firstname + ' ' + data.lastname);
        formData1.append('email', data.email);
        formData1.append('mobile', data.phonenumber);
        // formData1.append('password', data.password);
        formData1.append('address', data.address);
        formData1.append('country', data.country);
        formData1.append('state', data.state);
        formData1.append('city', data.city);
        formData1.append('pincode', data.pincode);
        formData1.append('user_id', user_id);
        // console.log(formData1.get('profile_image'));
        // this.userObj = {
        //   name: data.firstname + ' ' + data.lastname,
        //   email: data.email,
        //   mobile: data.phonenumber,
        //   address: data.address,
        //   country: data.country,
        //   state: data.state,
        //   city: data.city,
        //   pincode: data.pincode,
        //   user_id : user_id
        // };
        // console.log(this.userObj);

        this.__apiservice.editUserProfileInfo(formData1).subscribe((res: any) => {
          console.log(res);
          this.resEditProfileMsgCheck = 'success';
          this.resEditProfileMsg = 'Profile Edited Successfully!';
          setTimeout(() => {
          this.resEditProfileMsg = '';
          }, 3000);
          this.getFunction()
          form.reset();
        })
      }
      else {
        this.resEditProfileMsgCheck = 'danger';
        this.resEditProfileMsg = 'Please Fill the Fields Below!';
        setTimeout(() => {
          this.resEditProfileMsg = '';
        }, 2000);
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
          this.getFunction();
          // form.reset();
        })
      }
      else {
        this.resSignupMsg = 'Please fill the value';
      }
    }
  }
  // ngAfterViewInit() { }
  close() {
    this.renderer.setStyle(this.test.nativeElement, 'display', 'none');
    this.resSignupMsg = '';
  }
  goToTop() {
    window.scrollTo(0, 0);
    this.scroller.scrollToAnchor("backToTop");
    // console.log(this.userDetail)
  }
  changeTab() {
    this.itemEvent.emit('Edit Profile')
  }
  showDeatils(i: any) {
    this.orderHistoryDesc = [];
    this.orderHistoryDesc.push(i)
    console.log(this.orderHistoryDesc)
    this.show = !this.show;
  }

  getselecteddata(value: any) {
    console.log(value);
    this.searchItem = value;
    this.suggestions = false;
  }

  getSuggestions() {

    if (this.searchItem.length > 0) {
      this.suggestions = true;
    }

    else {
      this.suggestions = false;
      this.orderData = this.order;
    }

  }

  FetchSearchedData() {
    let product_search: any;
    this.orderData = []
    this.order.map((res: any) => {
      res.items.filter((resp: any) => {
        product_search = '';
        if (resp.product.name.includes(this.searchItem)) {
          product_search = res;
        }

        if (product_search) {
          console.log(product_search);
          this.orderData.push(product_search);
        }

        console.log(this.orderData);

      })
    })

    // this.orderData = [];
    // this.orderData.data.map((res:any)=>{
    //   res.data.map((resp: any) => {
    //     resp.items.map((response: any) => {
    //       if(response.product.name === this.searchItem){
    //         product_search = resp.product;
    //       }
    //       console.log(product_search);
    //     })
    //     // this.orderData.push(product_search);
    //   })
    // })
  }


  file: any = null;
  fileUrl: any;
  max_error_front_img: string = '';
  GetFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].size < 2000000) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.fileUrl = e.target.result;
        reader.readAsDataURL(event.target.files[0]);
        this.file = event.target.files[0];
        this.max_error_front_img = "";
      } else {
        this.max_error_front_img = "Max file upload size to 2MB";
        this.fileUrl = 'https://breakthrough.org/wp-content/uploads/2018/10/default-placeholder-image.png';
        this.file = null;
      }
    }
  }

  orderCancel(id: any) {
    console.log(id.order_id);
    this.__apiservice.CancelOrderApi(id.order_id)
      .then((res) => {
        if (res.code == 200) {
          this.getOrderhistory();
        }
        console.log(res);

      })
      .catch((error) => {
        console.log(error.error.code);
      })
  }
}

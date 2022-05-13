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
  file: any = null;
  searchItem: string = '';
  shimmerLoad: boolean = true;
  profileAddress: any = [];
  userObj: any;
  userDetail: any = [];
  invalidMobile = false;
  orderData: any = [];
  orderHistoryDesc: any = [];
  searchProductArray: any = [];
  passwrodCheck: boolean = false
  show: boolean = true;
  resSignupMsg: string = '';
  resSignupMsgCheck: string = ' ';
 
  suggestions: boolean = false;
  order: any = [];
  @Input() showdesc: any;
  constructor(private __apiservice: ApiServiceService, private scroller: ViewportScroller, private renderer: Renderer2, private router: Router) {
  }

  ngOnInit(): void {
    this.getFunction();
    this.getOrderhistory();
    // this.getReturnProduct();
    this.__apiservice.profiledashboard.subscribe((res:any) => {
      if(res) {
        this.getFunction();
        this.__apiservice.profiledashboard.next(false);
      }
    })
  }
  // <<--Get User deatils Function-->>
  getFunction() {
    this.userDetail = []
    this.__apiservice.getUserProfileDetail().
    subscribe((res: any) => {
      this.userDetail.push(res.data);
      this.shimmerLoad = false;
      this.userDetail.map((res: any) => {
        setTimeout(() => {
          res.firstname = res.name.split(" ")[0]
          res.lastname = res.name.split(" ")[1]
          console.log("res", res);
        }, 500);
      })
      console.log(this.userDetail);
    })
  }



  // <-- User Email Validation End -->


  // <-- for mobile validation End-->


  //<-- User Address -->
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
 
  // ***************************************Order History****************************************
  // <-- Get Order History -->
  getOrderhistory() {
    let product_search: any;
    this.__apiservice.getOrderData().subscribe((res: any) => {
      setTimeout(() => {
        this.orderData = res.data;
        this.order = res.data;
        console.log(this.orderData, "orderhistory");
        res.data.map((resp: any) => {
          resp.items.map((response: any) => {
            product_search = response.product;
          })
          this.searchProductArray.push(product_search);
        })
      }, 2000);
    })

  }
  // <-- Order History Details for Particular Product -->
  showDeatils(i: any) {
    this.orderHistoryDesc = [];
    this.orderHistoryDesc.push(i)
    console.log(this.orderHistoryDesc)
    this.show = !this.show;
  }
  // <-- Get Search Data from search bar on order history
  getselecteddata(value: any) {
    console.log(value);
    this.searchItem = value;
    this.suggestions = false;
  }
  // Order history search bar Suggestions 
  getSuggestions() {
    if (this.searchItem.length > 0) {
      this.suggestions = true;
    }
    else {
      this.suggestions = false;
      this.orderData = this.order;
    }
  }
  // <-- Fetch Order History Data from search Bar -->
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
  }
  // *************************************End**************************************************


  // <-- Back to top on edit profile page -->
  goToTop() {
    window.scrollTo(0, 0);
    this.scroller.scrollToAnchor("backToTop");
  }
  // <-- Close toaster --> 
  close() {
    this.renderer.setStyle(this.test.nativeElement, 'display', 'none');
    this.resSignupMsg = '';
  }
  // <-- Switch Tab On Edit Profile -->
  changeTab() {
    this.itemEvent.emit('Edit Profile')
  }

// <-- Cancel Order -->
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
  
  // <-- Return Order -->

  // storeReturnProduct(i: any) {
  //   let storeObj: any;
  //   console.log(i)
  //   storeObj = {
  //     order_id: i.order_id,
  //     order_item_id: i.id,
  //     product_id: i.product_id,
  //     quantity: i.quantity,
  //     reason: "Accidentally Placed Order",
  //     description: "test"
  //   }
  //   this.__apiservice.storeReturnOrder(storeObj).subscribe(res => {
  //     console.log(res)
  //   })
  // }
  // getReturnProduct() {
  //   this.__apiservice.getReturnOrder().subscribe(res => {
  //     setTimeout(() => {
  //       console.log("returndata", res)
  //     }, 1000);
  //   })
  // }

}

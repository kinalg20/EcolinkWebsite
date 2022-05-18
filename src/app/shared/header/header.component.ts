import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { FetchedHeaderState } from '../../store/state/header.state';
import { HeaderMenuAction } from '../../store/actions/header.action';
import { HttpErrorResponse } from '@angular/common/http';
import { CookiesService } from 'src/app/Services/cookies.service';
import { ViewportScroller } from '@angular/common';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() length: any;
  headerMenuData: any;
  isAlive = true;
  user_id: any;
  openMenu: boolean = false;
  openSubmenu: boolean = false;
  opensubSubmenu: boolean = false;
  homePageData: any = [];
  slug: any;
  data: any = []
  responseSubscribe: any = {}
  show: boolean = false;
  searchItem: string = '';
  subslug: any;
  suggestionList: any = [];
  showGlobalSearchSuggestion: any = false;

  @Select(FetchedHeaderState.getFetchedHeader) headerMenu$!: Observable<any>;
  @Select(FetchedHeaderState.getFetchedHeaderLoad) headerMenuDataLoaded$!: Observable<boolean>;

  constructor(private scroller: ViewportScroller, private _cookies: CookiesService, private route: Router, private __apiservice: ApiServiceService, private store: Store, private router: Router) { }
  routes: any = [
    {
      "id": "1",
      "route": ""
    },
    {
      "id": "2",
      "route": "/shop"
    },
    {
      "id": "3",
      "route": "/media"
    },
    {
      "id": "4",
      "route": "/ask-chemist"
    },
    {
      "id": "5",
      "route": "/blog"
    },
    {
      "id": "6",
      "route": "/"
    },
    {
      "id": "7",
      "route": "/shop"
    },
    {
      "id": "8",
      "route": "/about-us"
    },
  ];

  ngOnInit(): void {
    this.getAllHeaderMenu();
    this.headerMenu$.subscribe(res => {
      this.homePageData = [];
      if (res.data) {
        res.data.pages.map((response: any) => {
          this.homePageData.push(response);
        });
      }
    });
    setTimeout(() => {
      console.log("this.homePageData", this.homePageData);
    }, 1000);
    this.cartCountFunction();
    this.getSubscribeMsg();
  }
  getSubscribeMsg() {
    this.__apiservice.subscribedmsg.subscribe((res:any)=> {
      this.responseSubscribe=res;
      setTimeout(() => {
        this.responseSubscribe={};
      }, 6000);
    })
  }
  //Get product count from cart 
  cartCountFunction() {
    if (localStorage.getItem('ecolink_user_credential') != null) {
      this.__apiservice.getItemFromCart()
        .then((res) => {
          this.length = res.data.length;
        })

        .catch((error) => {
          this.length = 0;
        })
    }
    else {
      let cookiesdata = this._cookies.GetCartData();
      if (cookiesdata != 'empty') {
        this.length = cookiesdata.length;
      }
      else {
        this.length = 0;
      }
    }
  }
  //Go to profile page if user signed in
  profile() {
    if (localStorage.getItem("ecolink_user_credential") === null) {
      this.route.navigateByUrl('/profile/auth');
    }
    else {
      this.route.navigateByUrl('/profile');
    }
  }
  //open dropdown in mobile screen
  openmenu() {
    this.openMenu = !this.openMenu;
  }
  openDropDown() {
    this.openSubmenu = !this.openSubmenu
  }
  opensubDropDown() {
    console.log('subcategory')
    this.opensubSubmenu = !this.opensubSubmenu
  }
  //Suggestion when user search dynamically
  getSuggestion(data: any) {
    this.showGlobalSearchSuggestion = false;
    this.slug = data.category.slug;
    this.subslug = data.slug;
    this.searchItem = data.name;
  }
  //Global search function
  globalSearch() {
    console.log(this.searchItem);
    if (this.searchItem.length > 0) {
      this.__apiservice.globalSearchData(this.searchItem).subscribe(
        res => {
          this.showGlobalSearchSuggestion = true;
          this.suggestionList = res;
        },
        (error: HttpErrorResponse) => {
          if (error.error.code == 400) {
            this.showGlobalSearchSuggestion = false;
          }
        }
      )
    }
    else {
      this.showGlobalSearchSuggestion = false;
    }
  }

  userName:string='';
  userDetail:any;
  getAllHeaderMenu() {
    this.headerMenuData = this.headerMenuDataLoaded$.subscribe(res => {
      if (!res) {
        this.store.dispatch(new HeaderMenuAction());
      }
    })

    this.userDetail =  localStorage.getItem('ecolink_user_credential');
    if(this.userDetail ){
      let name = JSON.parse(this.userDetail);
      console.log(name.user.name);
      this.userName = name.user.name.split(" ")[0];
    }
  }
  //Route on Same page for header link in mobile view
  routeOnSamePage(slug: any, sublink?: any, subsublink?: any) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    if (subsublink) {
      this.router.navigate(['/' + slug + '/' + sublink + '/' + subsublink]);
    }
    else if (sublink) {
      this.router.navigate(['/' + slug + '/' + sublink]);
    }

    else {
      this.router.navigate(['/' + slug]);
    }
  }
  //go to map, when click on location icon
  goToLocation() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/' + 'contact']);
  }
  //for not repeating api calling
  ngOnDestroy(): void {
    this.isAlive = false;
    this.headerMenuData.unsubscribe();
  }
  //close subscribe mail popup 
  closeButton() {
    let object = {
      resSignupMsg: '',
      resSignupMsgCheck: '',
    }

    this.__apiservice.subscribedmsg.next(Object.assign({}, object));

  }
  //scroll down to up function
  scrollup(event: any) {
    console.log(event);
    this.responseSubscribe = event;
    this.scroller.scrollToAnchor('subscribeMsg');
  }
}
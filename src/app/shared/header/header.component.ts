import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { FetchedHeaderState } from '../../store/state/header.state';
import { HeaderMenuAction } from '../../store/actions/header.action';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  headerMenuData: any;
  isAlive = true;
  user_id: any;
  openMenu: boolean = false;
  openSubmenu: boolean = false;
  homePageData: any = [];
  slug: any;
  data: any = []
  show: boolean = false;
  searchItem: string = '';
  subslug: any;
  suggestionList: any = [];
  showGlobalSearchSuggestion: any = false;

  @Select(FetchedHeaderState.getFetchedHeader) headerMenu$!: Observable<any>;
  @Select(FetchedHeaderState.getFetchedHeaderLoad) headerMenuDataLoaded$!: Observable<boolean>;

  constructor(private route: Router, private __apiservice: ApiServiceService , private store : Store) { }
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
      if (res.data) {
        res.data.pages.map((response: any) => {
          this.homePageData.push(response);
        });
      }
    });
    
    setTimeout(() => {
      console.log("this.homePageData", this.homePageData);
    }, 1000);

  }
  profile() {
    if (localStorage.getItem("ecolink_user_credential") === null) {
      this.route.navigateByUrl('/profile/auth');
    }
    else {
      this.route.navigateByUrl('/profile');
    }
  }

  openmenu() {
    this.openMenu = !this.openMenu;
  }

  openDropDown() {
    this.openSubmenu = !this.openSubmenu
  }

  getSuggestion(data: any) {
    this.showGlobalSearchSuggestion = false;
    this.slug = data.category.slug;
    this.subslug = data.slug;
    this.searchItem = data.name;
  }

  globalSearch() {
    console.log(this.searchItem);
    if (this.searchItem.length > 0) {
      this.showGlobalSearchSuggestion = true;
      this.__apiservice.globalSearchData(this.searchItem).subscribe(res => {
        this.suggestionList = res;
      })
    }
    else {
      this.showGlobalSearchSuggestion = false;
    }
  }

  getAllHeaderMenu() {
    this.headerMenuData = this.headerMenuDataLoaded$.subscribe(res => {
      if (!res) {
        this.store.dispatch(new HeaderMenuAction());
      }
    })
  }

  ngOnDestroy(): void {
    this.isAlive = false;
    this.headerMenuData.unsubscribe();
  }
}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user_id: any;
  openMenu: boolean = false;
  openSubmenu: boolean = false;
  homePageData: any = [];
  slug: any;
  data : any = []
  show: boolean = false;
  searchItem: string = '';
  subslug: any;
  suggestionList: any = [];
  showGlobalSearchSuggestion:any = false;
  constructor(private route: Router, private __apiservice: ApiServiceService , private router :Router) { }
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
    this.__apiservice.home().subscribe((res: any) => {
      console.log(res)
      res.data.pages.map((response: any) => {
        this.homePageData.push(response);
      });
      setTimeout(() => {
        this.homePageData.map((res: any) => {
          this.routes.map((response: any) => {
            if (res.id == response.id) {
              res.routers = response.route;
            }
          })
        }, 500);
      })
    })
    // this.__apiservice.getPageBySlug(this.slug).subscribe((res:any)=>{
    //   this.data = res.data;
    //   console.log(res);
    // })
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
  openDropDown () {
    this.openSubmenu = !this.openSubmenu
  }

  showModalDialog(){
    this.show = true;
  }
  // getPage(slug:any){
  //   // routerLink="/inner-pages/{{item.slug}}"
  //   this.router.navigateByUrl('/innerpages/inner-pages/'+slug)
  // }

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

}
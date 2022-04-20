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
  homePageData: any = [];
  slug: any;
  data : any = []
  constructor(private route: Router, private __apiservice: ApiServiceService , private router :Router) { }
  routes: any = [
    {
      "id": "1",
      "route": ""
    },
    {
      "id": "2",
      "route": "/shop/allCategories"
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
      "route": "/shop/allCategories"
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

  // getPage(slug:any){
  //   // routerLink="/inner-pages/{{item.slug}}"
  //   this.router.navigateByUrl('/innerpages/inner-pages/'+slug)
  // }
}
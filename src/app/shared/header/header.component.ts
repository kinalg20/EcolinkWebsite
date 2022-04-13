import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user_id:any;
  
  homePageData:any=[];
  constructor(private route:Router,private __apiservice:ApiServiceService) { }
  routes:any=[
    {
      "id":"1",
      "route":"/about-us"
    },
    {
      "id":"2",
      "route":"/about-us"
    },
    {
      "id":"3",
      "route":"/about-us"
    },
    {
      "id":"4",
      "route":"/about-us"
    },
    {
      "id":"5",
      "route":"/about-us"
    },
    {
      "id":"6",
      "route":"/about-us"
    },
    {
      "id":"7",
      "route":"/about-us"
    },
    {
      "id":"8",
      "route":"/about-us"
    },
  ];
  ngOnInit(): void {
    this.__apiservice.home().subscribe((res:any)=>{
      res.data.pagecategories.map((response:any)=>{
        this.homePageData.push(response);
      });
      setTimeout(() => {
        console.log(this.homePageData)
      }, 2000);
    })
    this.homePageData.map((res:any)=>{
      setTimeout(() => {
        console.log(res);
      }, 500);
      this.routes.map((response:any)=>{
        console.log(response);
        console.log(res.id==response.id);
        if(res.id==response.id){
          res.route=response;
        }
      })
    })
    // setTimeout(() => {
    //   console.log(this.homePageData)
    // }, 5000);
  }
  profile(){
    if(localStorage.getItem("ecolink_user_credential")===null){
      this.route.navigateByUrl('/profile/auth');
    }
    else {
      this.route.navigateByUrl('/profile');
    }
  }
  
  
}

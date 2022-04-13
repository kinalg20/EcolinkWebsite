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
      this.homePageData.push(res);
      setTimeout(() => {
        console.log(this.homePageData[0])
      }, 500);
    })
    // this.homePageData.map((res:any)=>{
    //   console.log(res);
    //   this.routes.map((response:any)=>{
    //     res.route=response;
    //     console.log(res);
    //   })
    // })
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

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

  ngOnInit(): void {
    this.__apiservice.home().subscribe((res:any)=>{
      this.homePageData.push(res);
      setTimeout(() => {
        console.log(this.homePageData[0])
      }, 500);
    })
    this.homePageData.map((res:any)=>{
      res.data.pagecategories
    })
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

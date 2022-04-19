import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from '../Services/api-service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  openNav: boolean = false;
  togglebutton: string = 'Dashboard'
  constructor(private route: Router, private __apiservice:ApiServiceService) { }

  ngOnInit(): void {
  }
  openNavbar() {
    this.openNav = !this.openNav;
    // this.openNav = true;
  }
  getUserLogout() {
    console.log("kinal");
    // localStorage.removeItem("ecolink_user_credential");
    this.__apiservice.getUserLogoutProfile().subscribe((res:any)=> {
      console.log(res);
      console.log('jp')
    })
    this.route.navigateByUrl('/profile/auth');
  }
}

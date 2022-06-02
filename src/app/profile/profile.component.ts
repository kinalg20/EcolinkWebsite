import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TableCheckbox } from 'primeng/table';
import { ApiServiceService } from '../Services/api-service.service';
import { ProfileDashboardComponent } from './profile-dashboard/profile-dashboard.component';

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
  this.__apiservice.UserAddress.next("Edit Profile")
  }
  event(event:any) {
    this.togglebutton=event;
  }
  openNavbar() {
    this.openNav = !this.openNav;
    // this.openNav = true;
  }
  getUserLogout() {
    this.__apiservice.getUserLogoutProfile().subscribe((res:any)=> {
      console.log(res);
      localStorage.removeItem("ecolink_user_credential");
      localStorage.removeItem('email_token');
      this.route.navigateByUrl('/profile/auth');
    })
  }
}

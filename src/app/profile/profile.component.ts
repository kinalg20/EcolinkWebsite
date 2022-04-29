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
export class ProfileComponent implements OnInit,AfterViewInit {
  @ViewChild(ProfileDashboardComponent) child!:ProfileDashboardComponent;
  openNav: boolean = false;
  togglebutton: string = 'Dashboard'
  constructor(private route: Router, private __apiservice:ApiServiceService) { }
  ngAfterViewInit(): void {
    
  }


  ngOnInit(): void {
  }
  openNavbar() {
    if(this.child.tabCheck==false) {
      this.togglebutton='Edit Profile';
      this.child.tabCheck=true
    }
    this.openNav = !this.openNav;
    // this.openNav = true;
  }
  getUserLogout() {
    this.__apiservice.getUserLogoutProfile().subscribe((res:any)=> {
      console.log(res);
      localStorage.removeItem("ecolink_user_credential");
      this.route.navigateByUrl('/profile/auth');
    })
  }
}

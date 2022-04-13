import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { SharelibraryModule } from '../sharelibrary/sharelibrary.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { SignupSigninComponent } from './signup-signin/signup-signin.component';
import { ProfileDashboardComponent } from './profile-dashboard/profile-dashboard.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    ProfileComponent,
    SignupSigninComponent,
    ProfileDashboardComponent,
    ForgotPasswordComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharelibraryModule,
    FormsModule,
    SharedModule,
    HttpClientModule
  ],
})
export class ProfileModule {
  

 }

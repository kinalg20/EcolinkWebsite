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
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { BrowserModule } from '@angular/platform-browser';
import { ProductlistModule } from '../productlist/productlist.module';


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
    HttpClientModule,
    SocialLoginModule,
    ProductlistModule
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '394131620868-kdo7kpcg6tpejkv2tjk7u4ch1n6so9j6.apps.googleusercontent.com'
            )
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }

  ]
})
export class ProfileModule {


}

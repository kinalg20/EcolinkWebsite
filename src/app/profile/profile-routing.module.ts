import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ProfileComponent } from './profile.component';
import { SignupSigninComponent } from './signup-signin/signup-signin.component';

const routes: Routes = [
  { path: '',canActivate:[AuthGuard], component: ProfileComponent },
  { path: 'auth', component: SignupSigninComponent },
  { path: 'reset-password', component: ForgotPasswordComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }

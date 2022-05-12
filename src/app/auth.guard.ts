import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  user_authenticated: any;
  email_token: any;
  constructor(private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (localStorage.getItem('ecolink_user_credential')) {
      this.user_authenticated = localStorage.getItem('ecolink_user_credential');
      console.log(JSON.parse(this.user_authenticated).user.remember_token);
      if (JSON.parse(this.user_authenticated).user.remember_token == null) {
        this.router.navigateByUrl("/profile");
        return true;
      }

      else if (localStorage.getItem('email_token')) {
        this.email_token = localStorage.getItem('email_token');
        if (JSON.parse(this.user_authenticated).user.remember_token == JSON.parse(this.email_token)) {
          return true;
        }
        else {
          this.router.navigateByUrl("/profile/auth");
          return false;
        }
      }

      else {
        this.router.navigateByUrl("/profile/auth");
        // localStorage.removeItem('ecolink_user_credential');
        return false;
      }


    }
    else {
      this.router.navigateByUrl("/profile/auth");
      return false;
    }
  }

}

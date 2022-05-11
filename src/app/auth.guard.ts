import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  user_authenticated: any;
  constructor(private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (localStorage.getItem('ecolink_user_credential')) {
      this.user_authenticated = localStorage.getItem('ecolink_user_credential');
      console.log(JSON.parse(this.user_authenticated).user.remember_token);
      if (JSON.parse(this.user_authenticated).user.remember_token == null) {
        return true;
      }

      else{
        localStorage.removeItem('ecolink_user_credential');
        return false;
      }


    }
    else {
      this.router.navigateByUrl("/profile/auth");
      return false;
    }
  }

}

import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { UserService } from "../_services/user.service";
import { Observable } from "rxjs/Rx";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private _router: Router, private _userService: UserService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
     let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // if (currentUser && currentUser.token) {
    //   return true;
    // }
    // else {
    //   this._router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    //   return false;
    // };

    if(!this._userService.verify()){
        this._router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }

    if (route.data['permissions']) {
      if (currentUser && currentUser.permissions) {
        for (var i = 0; i < route.data['permissions'].length; i++) {
          if (currentUser.permissions.indexOf(route.data['permissions'][i]) === -1) {
            this._router.navigate(['/forbidden']);
            return false;
          }
        }
      } else {
        return false;
      }
    }
     return true; 
  }
}

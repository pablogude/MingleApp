import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
import { LocalStorageService } from './local-storage.service';

// An user has to be authenticated by Mingle App to have access to certain pages within our application

// canActivate is an Interface that a class can implement to be a guard deciding if a route can be activated. If all guards return true, navigation will continue. If any guard returns false, navigation will be cancelled

// ActivatedRouteSnapshot contains the information about a route associated with a component loaded in an outlet at a particular moment in time.

// Router -> Class that provides a service that allows navigation and URL manipulation capabilities.

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private router: Router,
    private localStorage: LocalStorageService
  ) {}

  canActivate(route:ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const loggedIn = this.isLoggedIn();

    let activate = loggedIn;
    let redirect = "/feed";

    // if you're not loggedIn, takes you to the register page
    if(route.data.loggedIn) {
      activate = !activate;
      redirect = "/register";
    }

    // if you're loggedIn takes you to de feed page /feed
    if(!activate) {
      return true;
    } else {
      this.router.navigate([redirect]);
      return false;
    }

  }

  // get access to localStorage to check if you are loggedIn or not
  isLoggedIn() {
    if(this.localStorage.getToken()) { return true; }
    return false;
  }

  // The easiest way to log out is removing the token
  // Takes you back to the login Page
  public logout() {
    this.localStorage.removeToken();
    this.router.navigate(['/login']);
  }
}

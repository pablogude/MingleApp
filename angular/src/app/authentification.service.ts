import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
import { LocalStorageService } from './local-storage.service';

// An user has to be authentificated by Mingle App to have access to certain pages within our application

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  constructor(
    private router: Router,
    private localStorage: LocalStorageService
  ) {}

  canActivate(route:ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const loggedIn = this.isLoggedIn();

    let activate = loggedIn;
    let redirect = "/feed";

    if(route.data.loggedIn) {
      activate = !activate;
      redirect = "/register";
    }

    if(!activate) {
      return true;
    } else {
      this.router.navigate([redirect]);
      return false;
    }

  }

  isLoggedIn() {
    if(this.localStorage.getToken()) { return true; }
    return false;
  }

  public logout() {
    this.localStorage.removeToken();
    this.router.navigate(['/login']);
  }
}

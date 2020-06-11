import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  tokenName = "--token-ASM-PROD";

  private set(key, value) {
    if(localStorage) {
      localStorage.setItem(key, value);
    } else {
      // Very unlikely to happen.
      alert('Browser does not support the localStorage API');
    }
  }

  private get(key) {
    if(localStorage) {
      if(key in localStorage){
        return localStorage.getItem(key);
      }
    } else {
      alert('Browser does not support the localStorage API');
    }
  }

  public setToken(token) {
    this.set(this.tokenName, token);
  }

  public getToken() {
    return this.get(this.tokenName);
  }

  public getParsedToken() {
    let token = this.getToken();
    // The atob() method decodes a base-64 encoded string.
    // A Json Web Token is formed by three differents strings separeted by dots -> we only need one of those segment of the string, that's the reason why we use the split() method in this case.
    return JSON.parse(atob(token.split(".")[1]));
  }

  public removeToken() {
    localStorage.removeItem(this.tokenName);
  }


}

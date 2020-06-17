import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';
import { EventEmitterService } from './event-emitter.service';
import { environment } from '../../environments/environment';

// HttpClient -> Performs HTTP requests.
// HttpHeaders -> Represents the header configuration options for an HTTP request.

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private localStrorage: LocalStorageService,
    private event:EventEmitterService
  ) { }

  // 2 possible URL -> 'http://localhost:3000' || 'https://immense-plains-08996.herokuapp.com'
  private baseUrl = environment.baseUrl;

  private succesHandler(value) { return value; }
  private errorHandler(error) { return error; }

  public makeRequest(requestObject): any {
    // make sure to make it lower case
    let type = requestObject.type.toLowerCase();
    if(!type) { return console.log("No type specified in the request object.") }
    // In case the request has no body -> provides an empty one
    let body = requestObject.body || {};
    let location = requestObject.location;

    if(!location) { return console.log("No location specified in the request object.") }

    let url = `${this.baseUrl}/${location}`;

    let httpOptions = {};

    // Request not available if you're not logged in
    if(requestObject.authorize) {
      httpOptions = {
        headers: new HttpHeaders({
          // Uses token to authorize request
          'Authorization': `Bearer ${this.localStrorage.getToken()}`
        })
      }
    }

    // Different types of requests

    if(type === "get") {
      return this.http.get(url, httpOptions).toPromise()
      .then(this.succesHandler)
      .catch(this.errorHandler);
    }

    if(type === "post") {
      return this.http.post(url, body, httpOptions).toPromise()
      .then(this.succesHandler)
      .catch(this.errorHandler);
    }

    if(type === "delete") {
      return this.http.post(url, body).toPromise()
      .then(this.succesHandler)
      .catch(this.errorHandler);
    }

  }


}

import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { LocalStorageService } from '../services/local-storage.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-page-register',
  templateUrl: './page-register.component.html',
  styleUrls: ['./page-register.component.css']
})
export class PageRegisterComponent implements OnInit {

  constructor(
    private api: ApiService,
    private localStorage: LocalStorageService,
    private router: Router,
    private title: Title
  ) { }

  ngOnInit(): void {
      this.title.setTitle("Mingle App - Register");
   }

  // Managing error & success messages

  public formError = "";
  public formSuccess = "";

  public credentials = {
    name: '',
    email: '',
    password: '',
    password_confirm: ''
  };

  public formSubmit() {
    this.formError = "";

    if(
      !this.credentials.name ||
      !this.credentials.email ||
      !this.credentials.password ||
      !this.credentials.password_confirm
    ) {
      return this.formError = "All fields are required";
    }

    // RegExp to know if the email address provided is valid or not

    var re = new RegExp(/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);

    if (!re.test(this.credentials.email)) {
      return this.formError = "Please enter a valid email address.";
    }

    // Control password length -> 8 characters minimum

    if(this.credentials.password.length < 8) {
      return this.formError = "Password should be at least 8 character long.";
    }

    if(this.credentials.password !== this.credentials.password_confirm) {
      return this.formError = "Passwords don't match";
    }

    this.register();
  }

  // Send a request to the Server

  private register() {
    let requestObject = {
      type: "POST",
      location: "users/register",
      body: this.credentials
    }

    this.api.makeRequest(requestObject).then((val) => {
      if(val.token) {                          this.localStorage.setToken(val.token);
        // Navigate to Feed
        this.router.navigate(['/']);
        return;
      }
      if(val.message) { this.formSuccess = val.message }

    });
  }
}

import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ApiService } from '../services/api.service';
import { LocalStorageService } from '../services/local-storage.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-page-feed',
  templateUrl: './page-feed.component.html',
  styleUrls: ['./page-feed.component.css']
})
export class PageFeedComponent implements OnInit {

  userList = [];

  constructor(
    public authentification: AuthenticationService,
    private api: ApiService,
    private title: Title,
    private localStorage: LocalStorageService
  ) { }

  ngOnInit() {

    this.title.setTitle("Mingle App - Grid");
    this.userId = this.localStorage.getParsedToken()._id;

    let requestObject = {
      type: "GET",
      location: "users/generate-feed",
      authorize: true
    }

    this.api.makeRequest(requestObject).then((val) => {

      let filterUsers = val.filter(x => x._id !== this.userId);
      this.userList = filterUsers;
    });

  }

  public userId: string = "";

}

import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ApiService } from '../services/api.service';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-page-messages',
  templateUrl: './page-messages.component.html',
  styleUrls: ['./page-messages.component.css']
})
export class PageMessagesComponent implements OnInit {

  messagesList = [];

  constructor(
    private title: Title,
    private localStorage: LocalStorageService,
    private api: ApiService
  ) { }

  ngOnInit(): void {

    this.title.setTitle("Messages");

    this.userid = this.localStorage.getParsedToken()._id;
    this.profilePicture = this.localStorage.getParsedToken().profile_img;

    let requestObjectMessage = {
      type: "GET",
      location: `users/messages/${this.localStorage.getParsedToken()._id}`,
      authorize: true
    }

    this.api.makeRequest(requestObjectMessage).then((val) => {

      this.messagesList = val.user.messages;

      if(this.messagesList.length > 0) {
        this.haveMessage = true;
      }


    });

  }


  public userid: string = "";
  public profilePicture: string = "avatar";
  public haveMessage: boolean = false;
}

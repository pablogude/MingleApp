import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from '../authentification.service';
import { LocalStorageService } from '../local-storage.service';
import { EventEmitterService } from '../event-emitter.service';
import { UserDataService } from '../user-data.service';
import { ApiService } from '../api.service';


@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  constructor(
    public authentification: AuthentificationService,
    private localStorage: LocalStorageService,
    private events: EventEmitterService,
    private api: ApiService,
  ) { }

  ngOnInit() {

    this.usersName = this.localStorage.getParsedToken().name;
    this.usersId = this.localStorage.getParsedToken()._id;
    this.profilePicture = this.localStorage.getParsedToken().profile_img;

    let alertEvent = this.events.onAlertEvent.subscribe((msg) => {
      this.alertMessage = msg;
    });

    this.events.getUserData.emit({user: "Placeholder User"});

    let requestObject = {
      location: `users/get-user-data/${this.localStorage.getParsedToken()._id}`,
      type: "GET",
    }

    this.notifications = this.api.makeRequest(requestObject).then((val) => {
      this.notifications = val.user.notifications;
    });

   }

   public resetNotifications() {

     let requestObject = {
       location: `users/reset-notifications/${this.localStorage.getParsedToken()._id}`,
       type: "POST",
     }

     this.api.makeRequest(requestObject).then((val) => {

     });
   }

  public usersName: string = "Mr No-One";
  public usersId: string = "";
  public profilePicture: string = "default-avatar";
  public alertMessage: string = "";
  public notifications: number = 0;

}

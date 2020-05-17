import { Component, OnInit, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { LocalStorageService} from '../local-storage.service';
import { ApiService } from '../api.service';
import { EventEmitterService } from '../event-emitter.service';

import * as $ from 'jquery';

@Component({
  selector: 'app-page-profile',
  templateUrl: './page-profile.component.html',
  styleUrls: ['./page-profile.component.css']
})
export class PageProfileComponent implements OnInit {

  @Input() user;

  constructor(
    private title: Title,
    private localStorage: LocalStorageService,
    private api: ApiService,
    private route: ActivatedRoute,
    private event: EventEmitterService,
  ) { }

  ngOnInit(): void {

    this.title.setTitle("Profile");
    this.userid = this.localStorage.getParsedToken()._id;
    this.usersName = this.localStorage.getParsedToken().name;

    this.route.params.subscribe((params) => {
      if(this.userid === this.route.snapshot.params.userid) {
        console.log("Your profile");
        this.profilePicture = this.localStorage.getParsedToken().profile_img;
        this.canSendMessage = false;
      }else {
        console.log("Not your profile");
        this.canSendMessage = true;

        let requestObject = {
          location: `users/get-user-data/${this.route.snapshot.params.userid}`,
          type: "GET",
        }

        this.api.makeRequest(requestObject).then((val) => {
          this.profilePicture = val.user.profile_img;
          this.usersName = val.user.name;
          this.sendMessageObj.name = val.user.name;

        });
      }
    });

  }

  public changeEditable() {
    this.isEditable = !this.isEditable;
  }

  public changeDispatchable() {
    this.isDispatchable = !this.isDispatchable;

    this.route.params.subscribe((params) => {

    });

  }


  public deleteUser() {

    let request = {
      location: `users/delete-user/${this.userid}`,
      type: "DELETE",
    }


    this.isEditable = !this.isEditable;

    this.api.makeRequest(request).then((val) => {
      if(val.message) { this.formSuccess = val.message }
    });


    this.localStorage.removeToken();


    setInterval(function(){
      location.reload();
    }, 500);

  }


  public confirmDelete() {
    this.deleteUser();
  }

  public showModal() {
    let modal = document.getElementById("myModal");
    // modal.showModal();
    // $("#myModal").modal()

  }

  public closeModal() {
    let modal = document.getElementById("myModal");
    // modal.close();
    // $("#myModal").close();

  }

  public formSubmit() {

    if(
      !this.credentials.name
    ) {
      return this.formError = "All fields are required";
    }

    if(!this.formError && this.credentials.name.length > 0) {
      this.updateUser();
    }
  }

  public updateUser() {

    let requestObject = {
      type: "POST",
      location: `users/update-user/${this.userid}`,
      body: this.credentials
    }

    this.api.makeRequest(requestObject).then((val) => {
      this.isEditable = !this.isEditable;
      if(val.message) { this.formSuccess = val.message }
      setInterval(function(){
        location.reload();
        this.route.navigate(['/feed']);
      }, 500);
    });

  }

  public updateSendMessageObject(id, name) {
    this.event.updateSendMessageObjectEvent.emit({id, name});
  }


  public userid: string = "";
  public usersName: string = "Mr No-One";
  public profilePicture: string = "";
  public canSendMessage: boolean = false;

  public isDispatchable: boolean = false;
  public isEditable: boolean = false;
  public makeSure: boolean = false;

  public sendMessageObj = {
    id: "",
    name: "",
    content: "",
    from: ""
  }

  public formError="";

  public formSuccess = "";

  public credentials = {
    name: ''
  };

  public sendMessage() {

    this.sendMessageObj.id = this.route.snapshot.params.userid;
    this.sendMessageObj.from = this.userid;


    if(!this.sendMessageObj.content) {
      this.event.onAlertEvent.emit("Message not sent. You mus provide some content");
      return;
    }

    let requestMessageObject = {
      location: `users/send-message/${this.sendMessageObj.id}`,
      type: "POST",
      body: {
        content: this.sendMessageObj.content,
        from: this.sendMessageObj.from
      }
    }

    this.api.makeRequest(requestMessageObject).then((val) => {

      if(!val) {
        this.event.onAlertEvent.emit("Something went wrong.");
      }

      this.event.onAlertEvent.emit("Successfully sent a message.");
    })

    this.sendMessageObj.content = "";
    this.isDispatchable = !this.isDispatchable;

    setInterval(function(){
      location.reload();
    }, 500);
  }

}

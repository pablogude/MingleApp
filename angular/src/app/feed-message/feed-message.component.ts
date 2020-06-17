import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { ApiService } from '../services/api.service';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-feed-message',
  templateUrl: './feed-message.component.html',
  styleUrls: ['./feed-message.component.css']
})
export class FeedMessageComponent implements OnInit, OnChanges {

  @Input() message;
  mss = [];

  constructor(
    private api: ApiService,
    private localStorage: LocalStorageService
  ) { }


  ngOnInit(): void {
  }

  ngOnChanges() {

    this.mss = this.message.content;

  }

  public deleteMessage() {

    let requestObject = {
      type: "DELETE",
      location: `users/delete-message/${this.localStorage.getParsedToken()._id}/${this.message._id}`,
    }


    this.api.makeRequest(requestObject).then((val) => {
      if(val.message) {
          this.formSuccess = val.message;
      }

    });

  }

  public formSuccess: string = ""
}

import { Component, OnInit, OnChanges, Input } from '@angular/core';

@Component({
  selector: 'app-feed-profile',
  templateUrl: './feed-profile.component.html',
  styleUrls: ['./feed-profile.component.css']
})
export class FeedProfileComponent implements OnInit, OnChanges {

  @Input() user;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges() {

  }

  public userId: string = "";

}

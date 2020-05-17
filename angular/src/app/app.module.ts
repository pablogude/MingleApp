import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './_app/app.component';
import { PageRegisterComponent } from './page-register/page-register.component';
import { PageLoginComponent } from './page-login/page-login.component';
import { PageFeedComponent } from './page-feed/page-feed.component';
import { PageProfileComponent } from './page-profile/page-profile.component';
import { PageMessagesComponent } from './page-messages/page-messages.component';
import { TopbarComponent } from './topbar/topbar.component';
import { FeedProfileComponent } from './feed-profile/feed-profile.component';
import { FooterComponent } from './footer/footer.component';
import { FeedMessageComponent } from './feed-message/feed-message.component';

@NgModule({
  declarations: [
    AppComponent,
    PageRegisterComponent,
    PageLoginComponent,
    PageFeedComponent,
    PageProfileComponent,
    PageMessagesComponent,
    TopbarComponent,
    FeedProfileComponent,
    FooterComponent,
    FeedMessageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

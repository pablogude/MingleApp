import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationService } from './authentication.service';

import { PageRegisterComponent } from './page-register/page-register.component';
import { PageLoginComponent } from './page-login/page-login.component';
import { PageFeedComponent } from './page-feed/page-feed.component';
import { PageProfileComponent } from './page-profile/page-profile.component';
import { PageMessagesComponent } from './page-messages/page-messages.component';

  // Path will be added to the baseUrl
  // serving data only when the user is loggedIn

const routes: Routes = [
  // in case you haven't logged out -> once you open the app, takes you to the feed-page
  {
    path: "",
    redirectTo: "/feed",
    pathMatch: "full"
  },{
    path: "register",
    component: PageRegisterComponent,
    canActivate: [AuthenticationService]
  },{
    path: "login",
    component: PageLoginComponent,
    canActivate: [AuthenticationService]
  },{
    path: "feed",
    component: PageFeedComponent,
    canActivate: [AuthenticationService],
    data: {loggedIn:true}
  },{
    path: "profile/:userid",
    component: PageProfileComponent,
    canActivate: [AuthenticationService],
    data: {loggedIn:true}
  },{
    path: "messages",
    component: PageMessagesComponent,
    canActivate: [AuthenticationService],
    data: {loggedIn:true}
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

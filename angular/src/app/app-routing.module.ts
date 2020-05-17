import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthentificationService } from './authentification.service';

import { PageRegisterComponent } from './page-register/page-register.component';
import { PageLoginComponent } from './page-login/page-login.component';
import { PageFeedComponent } from './page-feed/page-feed.component';
import { PageProfileComponent } from './page-profile/page-profile.component';
import { PageMessagesComponent } from './page-messages/page-messages.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "/feed",
    pathMatch: "full"
  },{
    path: "register",
    component: PageRegisterComponent,
    canActivate: [AuthentificationService]
  },{
    path: "login",
    component: PageLoginComponent,
    canActivate: [AuthentificationService]
  },{
    path: "feed",
    component: PageFeedComponent,
    canActivate: [AuthentificationService],
    data: {loggedIn:true}
  },{
    path: "profile/:userid",
    component: PageProfileComponent,
    canActivate: [AuthentificationService],
    data: {loggedIn:true}
  },{
    path: "messages",
    component: PageMessagesComponent,
    canActivate: [AuthentificationService],
    data: {loggedIn:true}
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

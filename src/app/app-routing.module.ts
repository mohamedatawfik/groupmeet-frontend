import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupsManagementComponent } from './homescreen/groups-management/groups-management.component';
import { CalendarComponent } from './homescreen/calendar/calendar.component';
import { LoginComponent } from './authenticate/login/login.component';
import { NavigationTabsComponent } from './navigation-tabs/navigation-tabs.component';
import { SignupComponent } from './authenticate/signup/signup.component';
import { CreateEventComponent } from './homescreen/calendar/create/createEvent.component';
import { AboutPageComponent } from './about-page/about-page.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'home', redirectTo: '/groups', pathMatch: 'full' },
  // { path: 'home', component: SidenavComponent },
  { path: 'groups', component: GroupsManagementComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'calendar/create', component: CreateEventComponent },
  {path: 'about', component:AboutPageComponent},
  { path: '', redirectTo: '/groups', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

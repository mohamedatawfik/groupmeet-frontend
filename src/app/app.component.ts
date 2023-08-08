import { Component } from '@angular/core';
import { SidenavComponent } from './sidenav/sidenav.component';
import { NavigationTabsComponent } from './navigation-tabs/navigation-tabs.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './header/header.component';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],




})
export class AppComponent {
  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') != null && localStorage.getItem('isLoggedIn') == 'true';
  }
}

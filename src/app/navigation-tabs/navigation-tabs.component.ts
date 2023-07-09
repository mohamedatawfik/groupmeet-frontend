import { Component } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { AppRoutingModule } from '../app-routing.module';
import { Router, NavigationEnd } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

// import { GroupsManagementComponent } from '../homescreen/groups-management/groups-management.component';
// import { CalendarComponent } from '../homescreen/calendar/calendar.component';


@Component({
  selector: 'app-navigation-tabs',
  templateUrl: './navigation-tabs.component.html',
  styleUrls: ['./navigation-tabs.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatSidenavModule,
    AppRoutingModule,
    MatButtonModule,
    // matTabNavBar,
    NgFor,
    // GroupsManagementComponent,
    // CalendarComponent
  ],

})


export class NavigationTabsComponent {
  links: { label: string; route: string }[] = [
    { label: 'Groups', route: '/groups' },
    { label: 'Calendar', route: '/calendar' }
  ];
  activeLink: any;

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const activeRoute = this.links.find(link => this.router.isActive(link.route, false));
        if (activeRoute) {
          this.activeLink = activeRoute;
        }
      }
    });
  }
}

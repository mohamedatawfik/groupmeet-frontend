import { Component } from '@angular/core';
import { NgForOf } from '@angular/common';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AppRoutingModule } from '../app-routing.module';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
  standalone: true,

  imports: [
    MatSidenavModule,
    MatListModule,
    AppRoutingModule,
    NgForOf,
    MatButtonModule,
    AppRoutingModule,
    MatIconModule
  ],
})

export class SidenavComponent {

  constructor(private router: Router) { }
  links: { label: string; route: string, icon: string }[] = [
    { label: 'Groups', route: 'groups', icon: 'supervisor_account' },
    { label: 'Calendar', route: 'calendar', icon: 'calendar_today' },
  ];

  onCreate() {
    this.router.navigate(['/calendar/create']);
  }
}

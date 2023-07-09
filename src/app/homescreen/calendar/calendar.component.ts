// references
// https://github.com/fullcalendar/fullcalendar-examples/tree/main/angular16
import { Component, signal, ChangeDetectorRef, TemplateRef, ViewChild, NgModule  } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { MatDialog } from '@angular/material/dialog'
import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Group } from '../groups-management/group';
import { Event } from './event';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EventInput } from '@fullcalendar/core';
import { map } from 'rxjs/operators';
import { EventType } from '@angular/router';
import { response } from 'express';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconButton } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule, NgFor } from '@angular/common';
import { MatListOption } from '@angular/material/list';
import { MatSelectionList } from '@angular/material/list';
import { MatSelectionListChange } from '@angular/material/list';
import { FormsModule, NgModel } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';

const TODAY_STR = new Date("2023-07-16").toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today
import { FullCalendarModule } from '@fullcalendar/angular';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  standalone: true,
  imports: [
    FullCalendarModule,
    NgIf,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    CommonModule,
    NgFor,
    FormsModule,
    HttpClientModule,
  ],
})

export class CalendarComponent {
  public user_events: Event[] = [];
  INITIAL_EVENTS: EventInput[] = []
  calendarVisible = signal(false);
  calendarOptions: CalendarOptions
  public groups: Group[] = [];
  chosen_group:any = '';
  cur_user = localStorage.getItem('token');

  constructor(private httpClient: HttpClient, private dialogRef: MatDialog) { 
  }
  ngOnInit() {
    this.getGroups().subscribe(data => this.groups = data);
    this.getEvents().subscribe(data => this.user_events = data);

    
    setTimeout(() => {
      let eventGuid = 0;
      for(let i = 0; i<this.user_events.length;i++)
   {
    console.log(this.user_events[i]['title'])
    console.log(this.user_events[i]['start'])
    console.log(this.user_events[i]['end'])
     this.INITIAL_EVENTS.push({id:String(1), title: this.user_events[i]['title'], start: this.user_events[i]['start'], end: this.user_events[i]['end']})
     eventGuid++;
   }  

   this.calendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
      
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    events: this.INITIAL_EVENTS,
    // initialEvents: new INITS(this.httpClient, this.dialogRef).INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
  };
  console.log(this.calendarOptions)
  console.log(this.user_events)
  console.log(this.INITIAL_EVENTS)
      this.calendarVisible = signal(true);
  console.log(this.calendarOptions)
       }, 1000);
       
    // console.log('het',new INITS(this.httpClient, this.dialogRef).doGet())
  }

  getGroups(): Observable<Group[]> {
    return this.httpClient.get<Group[]>(environment.API_URL + "/groups/"+localStorage.getItem('token'));
  }
  getEvents(): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.API_URL + "/events/"+localStorage.getItem('token'));
  }

  PostEvent(eventTitle: any, eventGroup: string, selectInfo:any) {
    const str_date = new Date(selectInfo.startStr).toISOString().replace(/T.*$/, '')+ 'T13:00:00';
    const end_date = new Date(selectInfo.startStr).toISOString().replace(/T.*$/, '')+ 'T15:00:00';
    
    let data = {title: eventTitle, group: eventGroup, start :str_date, end: end_date, user_mail:this.cur_user}
    console.log(data);
    return this.httpClient.post<any>(environment.API_URL + "/events/", data);
  }
 

  dialog: any;
  @ViewChild('addEventDialog') eventDialog = {} as TemplateRef<any>;
  currentEvents = signal<EventApi[]>([]);
  eventDetails = {title:'', group:''};

  // constructor(private changeDetector: ChangeDetectorRef) {
  // }

  async handleDateSelect(selectInfo: DateSelectArg) {
    
    const st = await this.openAddEventDialog(selectInfo);
    const title = this.eventDetails.title;
    const calendarApi = selectInfo.view.calendar;

    // calendarApi.unselect(); // clear date selection
    console.log(selectInfo);

    this.eventDetails = {title:'', group: ''};
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    // this.changeDetector.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
  }

  async openAddEventDialog(selectInfo: any) {
    this.dialog = this.dialogRef.open(this.eventDialog,
      { data: this.eventDetails, height: '350px', width: '350px' });
      console.log('Here');
      await this.dialog.afterClosed().toPromise().then((result: any) => {
        console.log(result);
        if (result.title.trim() != '' && result.group.trim() != '') {

          this.PostEvent(this.eventDetails.title, this.eventDetails.group, selectInfo).subscribe({
            next: (res) => {
              window.location.reload();
            },
            error: () => {
              // this.openAddMemberErrorDialog();
              alert("Error while adding the event, please try again");
            }
          });
        }
      });

  }
  onCancelDialog() {
    this.dialog.close();
  }

}

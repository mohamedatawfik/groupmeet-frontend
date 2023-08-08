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

  constructor(private httpClient: HttpClient, private dialogRef: MatDialog, private snackBar: MatSnackBar) { 
  }
  ngOnInit() {
    //get all groups of current user
    this.getGroups().subscribe(data => this.groups = data);
    //get all events of current user
    this.getEvents().subscribe(data => this.user_events = data);

    //initilize the calnedar events with the current user events 
    setTimeout(() => {
      let eventGuid = 0;
      for(let i = 0; i<this.user_events.length;i++)
   {
    console.log(this.user_events[i]['title'])
    console.log(this.user_events[i]['start'])
    console.log(this.user_events[i]['end'])
     this.INITIAL_EVENTS.push({id:String(eventGuid), title: this.user_events[i]['title']+'/'+this.user_events[i]['creator'], start: this.user_events[i]['start'], end: this.user_events[i]['end']})
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
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
  };
  console.log(this.calendarOptions)
  console.log(this.user_events)
  console.log(this.INITIAL_EVENTS)
      this.calendarVisible = signal(true);
  console.log(this.calendarOptions)
       }, 1000);
       
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

  deleteEventReq(title: string, cur_user:any) {
    return this.httpClient.delete<any>(environment.API_URL + "/events/" + title + '/' + cur_user);
  }

  getSingleEvent(title: string, creator:string) {
    return this.httpClient.get<string>(environment.API_URL + "/events/" + title + '/' + creator);
  }
 

  dialog: any;
  @ViewChild('addEventDialog') eventDialog = {} as TemplateRef<any>;
  @ViewChild('dispEventDialog') dispEventDialog = {} as TemplateRef<any>;
  currentEvents = signal<EventApi[]>([]);
  eventDetails = {title:'', group:''};
  singleEventName: string = '';

  doGetSingleEvent(title:string, creator:string)
  {
    this.getSingleEvent(title,creator).subscribe({
      next: (res) => {
        console.log("RES",res)
        this.singleEventName = res
      },
      error: (res) => {
      }
    })

  }
 

  async handleEventClick(clickInfo: EventClickArg) {
    const st = await this.openDispEventDialog(clickInfo);
    console.log(clickInfo.event.title)
   
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
  }

  async openDispEventDialog(clickInfo: any) {
    var title_creator = clickInfo.event.title.split('/');
    var title = title_creator[0];
    var creator = title_creator[1];
    var start = clickInfo.event.startStr;
    var end = clickInfo.event.endStr;
    this.getSingleEvent(title,creator).subscribe({

      next: async (res) => {
        console.log("RES",res)
        this.singleEventName = res
        if(!res)
        res = "Private Appointment"
        var data = {"title": title, "creator": creator, "start": start, "end": end, "group": res}
    this.dialog = this.dialogRef.open(this.dispEventDialog,
      { data: data, height: '350px', width: '500px' });
      console.log('Here');
      await this.dialog.afterClosed().subscribe((result: any) => {
        if(result=='D'){
          this.deleteEventReq(title, this.cur_user).subscribe({
            next: (res) => {
              window.location.reload();
            },
            error: () => {
              this.snackBar.open('You need admin rights to delete this event', 'Dismiss');

            }
          });}
      });

      },

      error: (res) => {
      }
    })
    

  }

  closeD() {
    this.onCancelDialog('D')
  }

  closeC() {
    this.onCancelDialog('C');
  }

  onCancelDialog(button: 'C' | 'D') {
    this.dialog.close(button);
  }

}

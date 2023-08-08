import { Component, signal, ChangeDetectorRef, TemplateRef, ViewChild, NgModule} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Group } from '../../groups-management/group';
import { BrowserModule } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-createEvent',
    templateUrl: './createEvent.component.html',
    styleUrls: ['./createEvent.component.css'],
    standalone: true,
    imports: [
        MatTabsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatButtonModule,
        NgxMatTimepickerModule,
        MatIconModule,
        MatFormFieldModule,
        MatDatepickerModule,
        FormsModule,
        ReactiveFormsModule,
        NgIf,
        NgFor,
        AsyncPipe,
        MatAutocompleteModule,
        HttpClientModule,
        ReactiveFormsModule
    ],
    providers: [

    ],
})

export class CreateEventComponent {
    cur_user = localStorage.getItem('token');
    group_meet_start: Date;
    group_meet_end:Date;
    chosen_group:string
    chosen_durartion:string

    getGroups(): Observable<Group[]> {
      return this.httpClient.get<Group[]>(environment.API_URL + "/groups/"+localStorage.getItem('token'));
    }
    
    PostEvent(eventTitle: any, eventGroup: string, start:Date, end:Date, duration:string) {
      let data = {title: eventTitle, group: eventGroup, start:start, end:end, user_mail:this.cur_user,duration:duration}
      console.log(data);
      return this.httpClient.post<any>(environment.API_URL + "/events/groupevent", data);
    }

    PostPrivateEvent(eventTitle: any, start:Date, end:Date) {
      
      let data = {title: eventTitle, start:start, end:end, user_mail:this.cur_user}
      console.log(data);
      return this.httpClient.post<any>(environment.API_URL + "/events/private", data);
    }

    
    range = new FormGroup({
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null),
      });

      myControl = new FormControl('');
      userGroups: Group[] = [];
      durations: String[] = ['1','1.5','2','2.5','3','3.5','4','4.5','5'];
      filteredOptions: Observable<string[]>;

    constructor(private httpClient: HttpClient, private snackBar: MatSnackBar) {
    }

    // get all groups of the current user 
    ngOnInit() {
    this.getGroups().subscribe(data => this.userGroups = data);
      }

      CreateGroupMeeting(event: Event, form: NgForm) {
        event.preventDefault();
        console.log();
        console.log(this.group_meet_end);
        console.log("Entered")
        if(!this.chosen_durartion || form.value.titile == ''|| form.value.group == ''|| !this.group_meet_end|| !this.group_meet_start)
        {
          this.snackBar.open('please check the data you entered', 'Dismiss');
        }
        else{
        this.PostEvent(form.value.title, form.value.group, this.group_meet_start, this.group_meet_end, this.chosen_durartion).subscribe({
          next: (res) => {
            this.snackBar.open('Event added successfully', 'Dismiss');
            
          },
          error: () => {
            this.snackBar.open('something went wrong please try again', 'Dismiss');
          }
        });
      }
      }

      CreatePrivateMeeting(event: Event, form: NgForm) {
        event.preventDefault();

        if(form.value.titile == ''|| !form.value.startTime|| !form.value.endTime|| !form.value.day)
        {
          this.snackBar.open('please check the data you entered', 'Dismiss');
        }

        else{
          var day = new Date(form.value.day);
          day.setDate(day.getDate()+1);
          let final_day = day.toISOString().replace(/T.*$/, '');
          let start_time = final_day + 'T' + form.value.startTime
          let end_time = final_day + 'T' + form.value.endTime
  
        this.PostPrivateEvent(form.value.title, new Date(start_time), new Date(end_time)).subscribe({
          next: (res) => {
            this.snackBar.open('Event added successfully', 'Dismiss');

          },
          error: () => {
            this.snackBar.open('something went wrong please try again', 'Dismiss');
          }
        });
      }
      }

      dateRangeChange(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
        this.group_meet_start= new Date(dateRangeStart.value)
        this.group_meet_end= new Date(dateRangeEnd .value)
        console.log(this.group_meet_end)
        

      }
}


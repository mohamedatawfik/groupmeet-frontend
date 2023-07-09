import { Component} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

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




    ],
})

export class CreateEventComponent {

    range = new FormGroup({
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null),
      });

      myControl = new FormControl('');
      userGroups: string[] = ['One', 'Two', 'Three'];
      filteredOptions: Observable<string[]>;

    constructor() {
    }

    ngOnInit() {
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value || '')),
        );
      }

      private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
    
        return this.userGroups.filter(option => option.toLowerCase().includes(filterValue));
      }
}


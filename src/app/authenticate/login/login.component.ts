import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { AuthenticateService } from '../../services/authenticate.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    MatButtonModule,
    MatDividerModule,
    MatSnackBarModule,
    MatDialogModule
  ],
})

export class LoginComponent {

  constructor(private service: AuthenticateService, private router: Router, private snackBar: MatSnackBar, public dialog: MatDialog) { }

  ngOnInit(): void {
    if (this.isLoggedIn()) {
      this.loginProceed();
    }
  }

  loginAction(event: Event, form: NgForm) {
    event.preventDefault();
    if (!this.dataValidation(form.value)) {
      this.snackBar.open('Invalid input', 'Dismiss');
    };
    // Handle login logic here
    var res = this.service.login(form.value).subscribe((res: any) => {
      if (res.status == 200) {
        localStorage.setItem('token', res.body.token);
        localStorage.setItem('isLoggedIn', 'true');
        this.loginProceed();
      }
      else {
        localStorage.setItem('isLoggedIn', 'false');
        this.snackBar.open(res.body.message, 'Dismiss');
      };
    })
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') != null && localStorage.getItem('isLoggedIn') == 'true';
  }

  loginProceed() {
    this.router.navigate(['/home']);
  }

  signupAction() {
    this.router.navigate(['/signup']);
  }

  dataValidation(data: any): boolean {

    try {
      data.email = data.email.trim();
      if (data.email == null || data.password == null) {
        throw new Error('Null data');
      }
    } catch (e) {
      return false;
    }
    return true;
  }

}

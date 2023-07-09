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


@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css'],
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
    ],
})

export class SignupComponent {

    constructor(private service: AuthenticateService, private router: Router, private snackBar: MatSnackBar, public dialog: MatDialog) { }

    ngOnInit(): void {
        if (this.isLoggedIn()) {
            this.signupProceed();
        }
    }

    signupAction(event: Event, form: NgForm) {
        event.preventDefault();
        if (!this.dataValidation(form.value)) {
            this.snackBar.open('Invalid input', 'Dismiss');
            return;
        };
        // Handle login logic here
        var res = this.service.signup(form.value).subscribe((res: any) => {
            if (res.status == 201) {
                localStorage.setItem('token', res.body.token);
                localStorage.setItem('isLoggedIn', 'true');
                this.signupProceed();
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

    signupProceed() {
        this.router.navigate(['/home']);
    }

    loginAction() {
        this.router.navigate(['/login']);
    }

    dataValidation(data: any): boolean {

        try {
            data.email = data.email.trim();
            if (
                data.email == null ||
                data.email == '' ||
                data.password == null ||
                data.password == '' ||
                data.name == null ||
                data.name == '' ||
                data.confirmPassword == null ||
                data.confirmPassword == '' ||
                data.password != data.confirmPassword) {

                throw new Error('Null data');
            }
        } catch (e) {
            return false;
        }
        return true;
    }
}

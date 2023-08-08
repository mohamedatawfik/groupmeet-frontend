import { Component, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Group } from './group';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog'
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
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



@Component({
  selector: 'app-group-list',
  templateUrl: './groups-management.component.html',
  styleUrls: ['./groups-management.component.css'],
  standalone: true,
  imports: [
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
  ]
})
export class GroupsManagementComponent {

  public groups: Group[] = [];
  public groups2: Group[] = [];
  cur_user:any = localStorage.getItem('token');
  dialog: any;
  @ViewChild('groupMembersDialog') infoDialog = {} as TemplateRef<any>;
  @ViewChild('addMemberDialog') memberDialog = {} as TemplateRef<any>;
  @ViewChild('addMemberErrorDialog') memberErrorDialog = {} as TemplateRef<any>;

  constructor(private httpClient: HttpClient, private dialogRef: MatDialog, private snackBar: MatSnackBar, private router: Router ) { }

  ngOnInit() {

    if (localStorage.getItem('isLoggedIn') != 'true') {
      this.router.navigate(['/login']);
    }

    this.getGroups().subscribe(data => this.groups = data);
  }

  getGroups(): Observable<Group[]> {
    return this.httpClient.get<Group[]>(environment.API_URL + "/groups/"+this.cur_user);
  }

  postGroup(data: any) {
    return this.httpClient.post<any>(environment.API_URL + "/groups/", data);
  }

  UpdateGroup(data: any, name: string) {
    return this.httpClient.patch<any>(environment.API_URL + "/groups/" + name, data);
  }

  deleteGroupReq(name: string, cur_user:any) {
    return this.httpClient.delete<any>(environment.API_URL + "/groups/" + name + '/' + cur_user);
  }

  deleteGroupMember(info: any) {
    return this.httpClient.patch<any>(environment.API_URL + "/groups/delete_member", info);
  }

  getSingleGroup(name: string) {
    console.log("Name", name);
    return this.httpClient.get<Group[]>(environment.API_URL + "/groups/" + name);
  }

  newMemberEmail: string = '';
  newMemberGroupName: string = '';
  activeGroup: string = '';
  deletG: String = '';

  // Create a new group
  createGroup(newGroupName: NgModel) {
    console.log("New Group Name", newGroupName);
   newGroupName = newGroupName.value.trim();
    let newGroup = {
      "name": newGroupName,
      "members": [this.cur_user]
    }
    this.postGroup(newGroup)
      .subscribe({
        next: (res) => {
          this.snackBar.open(res.message, "Dismiss");
        },
        error: (res) => {
          this.snackBar.open(res.error.error, "Dismiss");
        }
      })
    window.location.reload();
  }


  // Delete a group
  deleteGroup(group: string) {
    this.deleteGroupReq(group, this.cur_user)
      .subscribe({
        next: (res) => {
          this.snackBar.open(res.message, "Dismiss");
        },
        error: (res) => {
          this.snackBar.open(res.error.error, "Dismiss");
        }
      })
    window.location.reload();

  }

  // Get members of a group
  getGroupMembers(group: string): string[] {
    for (var index in this.groups) {
      if (this.groups[index].name == group) {
        return this.groups[index].members;
      }
    }
    return [''];
  }

  // Member dialog
  openGroupMembersDialog(group: any): void {
    this.dialog = this.dialogRef.open(this.infoDialog, {
      data: group, height: '200px', width: '400px'
    });
  }

  // Add a new member
  openAddMemberDialog(groupName: string) {
    let newMail = { members: '', groupName:groupName }
    this.dialog = this.dialogRef.open(this.memberDialog,
      { data: newMail, height: '350px', width: '350px' });

    this.dialog.afterClosed().subscribe((result: NgModel) => {
      console.log(result);
      if (result.value.members != '') {
        let newMailUpated = { "members": [newMail.members.trim()] , "cur_user": this.cur_user};
        this.UpdateGroup(newMailUpated, groupName).subscribe({
          next: (res) => {
            window.location.reload();
          },
          error: () => {
            this.openAddMemberErrorDialog(groupName);
          }
        });
      }
    });
  }

  onDialogAddAction(pairEmail: NgModel, groupName: string) {
    var email:string  = pairEmail.value;
    if (email != '') {
      let newMailUpated = { "members": [email.trim()] , "cur_user": this.cur_user};
      this.UpdateGroup(newMailUpated, groupName).subscribe({
        next: (res) => {
          window.location.reload();
        },
        error: (res) => {
          console.log(res);
          this.snackBar.open(res.error.error, 'Dismiss');
        }
      });
    }
  }

  onCancelAddDialog() {
    this.dialog.close();
  }

  openAddMemberErrorDialog(groupName: string) {
    this.dialog = this.dialogRef.open(this.memberErrorDialog,
     {data: {groupName}});
  }

  onCancelAddErrorDialog() {
    this.dialog.close();
  }

  removeMember(groupName: string, member: string) {
    let info = { "name": groupName.trim(), "members": member.trim(), "cur_user": this.cur_user };

    this.deleteGroupMember(info)
      .subscribe({
        next: (res) => {
          this.snackBar.open('Member Deleted Successfully', 'Dismiss');
        },
        error: () => {
          this.snackBar.open('Error while deleteing the Member', 'Dismiss');
        }
      })
    window.location.reload();
  }
}

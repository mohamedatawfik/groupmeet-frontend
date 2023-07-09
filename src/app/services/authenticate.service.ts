import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  apiurl: string = environment.API_URL + "/auth";
  loginPath: string = "/login";
  signupPath: string = "/register";

  constructor(private http: HttpClient) { }

  login(UserCred: any) {
    return this.http.post(this.apiurl + this.loginPath, UserCred,  {observe: 'response'});
  }

  signup(UserCred: any) {
    return this.http.post(this.apiurl + this.signupPath, UserCred,  {observe: 'response'});
  }
}

import { Injectable } from '@angular/core';
import {AppUser} from "../models/user.model";
import {Observable, of, throwError} from "rxjs";
import * as uuid from "uuid";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  users : AppUser[] = [];
  authenticatedUser : AppUser | undefined;

  constructor() {
    this.users.push({userId : uuid.v4(), username : "admin", password : "admin", roles : ["USER","ADMIN"]});
    this.users.push({userId : uuid.v4(), username : "user1", password : "1234", roles : ["USER","ADMIN"]});
    this.users.push({userId : uuid.v4(), username : "user2", password : "1234", roles : ["USER"]});
    this.users.push({userId : uuid.v4(), username : "user3", password : "1234", roles : ["USER"]});
  }

  public login(username : string, password : string) : Observable<AppUser> {
    let appUser = this.users.find( u => u.username == username);
    if(!appUser) return throwError(() => new Error("User not found"));
    if(appUser.password!=password) return throwError(() => new Error("Bad Credentials"));
    return of(appUser);
  }

  public authenticateUser(appUser : AppUser) : Observable<boolean> {
    this.authenticatedUser = appUser;
    localStorage.setItem("authUser", JSON.stringify({username : appUser.username, roles : appUser.roles, jwt : "JWT_TOKEN"}))
    return of(true);
  }

  public hasRole(role : string) : boolean {
    return !!this.authenticatedUser?.roles.includes(role);
  }

  public isAuthenticated(){
    return this.authenticatedUser != undefined;
  }

  public logout() : Observable<boolean>{
    this.authenticatedUser = undefined;
    localStorage.removeItem("authUser")
    return of(true);
  }
}

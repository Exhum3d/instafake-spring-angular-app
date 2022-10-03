import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {environment} from "../../environments/environment";
import {JwtHelperService} from "@auth0/angular-jwt";
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {UserSignup} from "../model/user-signup.model";
import {User} from "../model/user.model";
import {UserLogin} from "../model/user-login.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  logoutSubject = new Subject<boolean>();
  loginSubject = new Subject<User>();
  private host = environment.apiUrl;
  private authToken: string;
  private authUser: User;
  private principal: string;
  private jwtService = new JwtHelperService();

  constructor(private httpClient: HttpClient) {
  }

  signup(userSignup: UserSignup): Observable<HttpResponse<any> | HttpErrorResponse> {
    return this.httpClient.post<HttpResponse<any> | HttpErrorResponse>(`${this.host}/signup`, userSignup);
  }

  logout(): void {
    this.authToken = null;
    this.authUser = null;
    this.principal = null;
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
    this.logoutSubject.next(true);
  }

  storeTokenInCache(authToken: string): void {
    if (authToken != null && authToken != '') {
      this.authToken = authToken;
      localStorage.setItem('authToken', authToken);
    }
  }

  loadTokenFromCache(): string {
    return localStorage.getItem('authToken');
  }

  storeAuthUserInCache(authUser: User): void {
    if (authUser != null) {
      this.authUser = authUser;
      localStorage.setItem('authUser', JSON.stringify(authUser));
    }
    this.loginSubject.next(authUser);
  }

  getAuthUserFromCache(): User {
    return JSON.parse(localStorage.getItem('authUser'));
  }

  isUserLoggedIn(): boolean {
    this.loadTokenFromCache();

    if (this.authToken != null && this.authToken != '') {
      if (this.jwtService.decodeToken(this.authToken).sub != null || '') {
        if (!this.jwtService.isTokenExpired(this.authToken)) {
          this.principal = this.jwtService.decodeToken(this.authToken).sub;
          return true;
        }
      }
    }

    this.logout();
    return false;
  }

  login(userLogin: UserLogin): Observable<HttpResponse<User> | HttpErrorResponse> {
    return this.httpClient.post<User>(`${this.host}/login`, userLogin, {observe: 'response'});
  }
}

import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {JwtHelperService} from "@auth0/angular-jwt";
import {HttpClient, HttpErrorResponse, HttpParams, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../model/user.model";

class UserResponse {
}

class PostResponse {
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private host = environment.apiUrl;
  private jwtService = new JwtHelperService();

  constructor(private httpClient: HttpClient) {
  }

  getUserById(userId: number): Observable<UserResponse | HttpErrorResponse> {
    return this.httpClient.get<UserResponse | HttpErrorResponse>(`${this.host}/users/${userId}`);
  }

  getUserFollowingList(userId: number, page: number, size: number): Observable<UserResponse[] | HttpErrorResponse> {
    const reqParams = new HttpParams().set('page', page).set('size', size);
    return this.httpClient.get<UserResponse[] | HttpErrorResponse>(`${this.host}/users/${userId}/following`, {params: reqParams});
  }

  getUserFollowerList(userId: number, page: number, size: number): Observable<UserResponse[] | HttpErrorResponse> {
    const reqParams = new HttpParams().set('page', page).set('size', size);
    return this.httpClient.get<UserResponse[] | HttpErrorResponse>(`${this.host}/users/${userId}/follower`, {params: reqParams});
  }

  getUserPosts(userId: number, page: number, size: number): Observable<PostResponse[] | HttpErrorResponse> {
    const reqParams = new HttpParams().set('page', page).set('size', size);
    return this.httpClient.get<PostResponse[] | HttpErrorResponse>(`${this.host}/users/${userId}/posts`, {params: reqParams});
  }

  updateProfilePhoto(profilePhoto: File): Observable<User | HttpErrorResponse> {
    const formData = new FormData();
    formData.append('profilePhoto', profilePhoto);
    return this.httpClient.post<User | HttpErrorResponse>(`${this.host}/account/update/profile-photo`, formData);
  }

  updateCoverPhoto(coverPhoto: File): Observable<User | HttpErrorResponse> {
    const formData = new FormData();
    formData.append('coverPhoto', coverPhoto);
    return this.httpClient.post<User | HttpErrorResponse>(`${this.host}/account/update/cover-photo`, formData);
  }

  followUser(userId: number): Observable<any | HttpErrorResponse> {
    return this.httpClient.post<any | HttpErrorResponse>(`${this.host}/account/follow/${userId}`, null);
  }

  unfollowUser(userId: number): Observable<any | HttpErrorResponse> {
    return this.httpClient.post<any | HttpErrorResponse>(`${this.host}/account/unfollow/${userId}`, null);
  }
}

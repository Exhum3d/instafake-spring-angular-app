import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

class PostResponse {
}

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private host = environment.apiUrl;

  constructor(private httpClient: HttpClient) {
  }

  getFeedPosts(page: number, size: number): Observable<PostResponse[] | HttpErrorResponse> {
    const reqParams = new HttpParams().set('page', page).set('size', size);
    return this.httpClient.get<PostResponse[] | HttpErrorResponse>(`${this.host}/`, {params: reqParams});
  }

}

import {Injectable} from '@angular/core';
import {User} from '../model/user.model';
import {environment} from "../../environments/environment";
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Post} from "../model/post.model";
import {PostResponse} from "../model/post-response.model";
import {CommentResponse} from "../model/comment-response.model";

@Injectable({
  providedIn: 'root'
})
export class PostService {
  authUser: User;
  private host = environment.apiUrl;

  constructor(private httpClient: HttpClient) {
  }

  createNewPost(content: string, postPhoto: File, postTags: any[]): Observable<Post | HttpErrorResponse> {
    const formData = new FormData();
    formData.append('text', content);
    formData.append('image', postPhoto);
    return this.httpClient.post<Post | HttpErrorResponse>(`${this.host}/posts/create`, formData);
  }

  updatePost(postId: number, content: string, postPhoto: File, postTags: any[]): Observable<Post | HttpErrorResponse> {
    const formData = new FormData();
    formData.append('text', content);
    formData.append('image', postPhoto);
    return this.httpClient.post<Post | HttpErrorResponse>(`${this.host}/posts/${postId}/update`, formData);
  }

  deletePostPhoto(postId: number): Observable<any | HttpErrorResponse> {
    return this.httpClient.post<any | HttpErrorResponse>(`${this.host}/posts/${postId}/photo/delete`, null);
  }

  deletePost(postId: number, isTypeShare: boolean): Observable<any | HttpErrorResponse> {
    if (isTypeShare) {
      return this.httpClient.post<any | HttpErrorResponse>(`${this.host}/posts/${postId}/share/delete`, null);
    } else {
      return this.httpClient.post<any | HttpErrorResponse>(`${this.host}/posts/${postId}/delete`, null);
    }
  }

  getPostById(postId: number): Observable<PostResponse | HttpErrorResponse> {
    return this.httpClient.get<PostResponse | HttpErrorResponse>(`${this.host}/posts/${postId}`);
  }

  getPostLikes(postId: number, page: number, size: number): Observable<User[] | HttpErrorResponse> {
    const reqParams = new HttpParams().set('page', page).set('size', size);
    return this.httpClient.get<User[] | HttpErrorResponse>(`${this.host}/posts/${postId}/likes`, {params: reqParams});
  }

  getPostComments(postId: number, page: number, size: number): Observable<CommentResponse[] | HttpErrorResponse> {
    const reqParams = new HttpParams().set('page', page).set('size', size);
    return this.httpClient.get<CommentResponse[] | HttpErrorResponse>(`${this.host}/posts/${postId}/comments`, {params: reqParams});
  }

  getPostShares(postId: number, page: number, size: number): Observable<PostResponse[] | HttpErrorResponse> {
    const reqParams = new HttpParams().set('page', page).set('size', size);
    return this.httpClient.get<PostResponse[] | HttpErrorResponse>(`${this.host}/posts/${postId}/shares`, {params: reqParams});
  }

  likePost(postId: number): Observable<any | HttpErrorResponse> {
    return this.httpClient.post<any | HttpErrorResponse>(`${this.host}/posts/${postId}/like`, null);
  }

  unlikePost(postId: number): Observable<any | HttpErrorResponse> {
    return this.httpClient.post<any | HttpErrorResponse>(`${this.host}/posts/${postId}/unlike`, null);
  }

  createPostComment(postId: number, content: string): Observable<CommentResponse | HttpErrorResponse> {
    const formData = new FormData();
    formData.append('content', content);
    return this.httpClient.post<CommentResponse | HttpErrorResponse>(`${this.host}/posts/${postId}/comments/create`, formData);
  }

  likePostComment(commentId: number): Observable<any | HttpErrorResponse> {
    return this.httpClient.post<any | HttpErrorResponse>(`${this.host}/posts/comments/${commentId}/like`, null);
  }

}

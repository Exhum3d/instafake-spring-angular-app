import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {CommentResponse} from "../../model/comment-response.model";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {environment} from "../../../environments/environment";
import {Subscription} from "rxjs";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {Post} from "../../model/post.model";
import {AuthService} from "../../service/auth.service";
import {PostService} from "../../service/post.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpErrorResponse} from "@angular/common/http";
import {SnackBarComponent} from "../snack-bar/snack-bar.component";
import {Constants} from "../../shared/constants";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";

class CommentService {
}

@Component({
  selector: 'app-post-comment-dialog',
  templateUrl: './post-comment-dialog.component.html',
  styleUrls: ['./post-comment-dialog.component.css']
})
export class PostCommentDialogComponent implements OnInit {
  @Output() updatedCommentCountEvent = new EventEmitter<number>();
  @Output() newItemEvent = new EventEmitter<string>();
  authUserId: number;
  commentResponseList: CommentResponse[] = [];
  resultPage: number = 1;
  resultSize: number = 5;
  hasMoreResult: boolean = false;
  fetchingResult: boolean = false;
  creatingComment: boolean = false;
  commentFormGroup: FormGroup;
  defaultProfilePhotoUrl = environment.defaultProfilePhotoUrl;

  private subscriptions: Subscription[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public dataPost: Post,
    private authService: AuthService,
    private postService: PostService,
    private commentService: CommentService,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private matSnackbar: MatSnackBar) {
  }

  get content() {
    return this.commentFormGroup.get('content')
  }

  ngOnInit(): void {
    this.authUserId = this.authService.getAuthUserId();

    this.commentFormGroup = this.formBuilder.group({
      content: new FormControl('', [Validators.required, Validators.maxLength(1024)])
    });

    this.loadComments(1);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadComments(currentPage: number): void {
    if (!this.fetchingResult) {
      if (this.dataPost.commentCount > 0) {
        this.fetchingResult = true;

        this.subscriptions.push(
          this.postService.getPostComments(this.dataPost.id, currentPage, this.resultSize).subscribe({
            next: (resultList: CommentResponse[]) => {
              resultList.forEach(commentResponse => this.commentResponseList.push(commentResponse));
              if (currentPage * this.resultSize < this.dataPost.commentCount) {
                this.hasMoreResult = true;
              } else {
                this.hasMoreResult = false;
              }
              this.resultPage++;
              this.fetchingResult = false;
            },
            error: (errorResponse: HttpErrorResponse) => {
              this.matSnackbar.openFromComponent(SnackBarComponent, {
                data: Constants.snackbarErrorContent,
                panelClass: ['bg-danger'],
                duration: 5000
              });
              this.fetchingResult = false;
            }
          })
        );
      }
    }
  }

  createNewComment(): void {
    this.creatingComment = true;
    this.subscriptions.push(
      this.postService.createPostComment(this.dataPost.id, this.content.value).subscribe({
        next: (newComment: CommentResponse) => {
          this.commentFormGroup.reset();
          Object.keys(this.commentFormGroup.controls).forEach(key => {
            this.commentFormGroup.get(key).setErrors(null);
          });
          this.commentResponseList.unshift(newComment);
          this.updatedCommentCountEvent.emit(this.commentResponseList.length);
          this.creatingComment = false;

        },
        error: (errorResponse: HttpErrorResponse) => {
          this.matSnackbar.openFromComponent(SnackBarComponent, {
            data: Constants.snackbarErrorContent,
            panelClass: ['bg-danger'],
            duration: 5000
          });
          this.creatingComment = false;
        }
      })
    );
  }

  openCommentLikeDialog(comment: Comment): void {
    // this.matDialog.open(CommentLikeDialogComponent, {
    //   data: comment,
    //   minWidth: '500px',
    //   maxWidth: '700px'
    // });
  }

  likeOrUnlikeComment(commentResponse: CommentResponse) {
    // if (commentResponse.likedByAuthUser) {
    //   this.subscriptions.push(
    //     this.commentService.unlikeComment(commentResponse.comment.id).subscribe({
    //       next: (response: any) => {
    //         const targetCommentResponse = this.commentResponseList.find(cR => cR === commentResponse);
    //         targetCommentResponse.likedByAuthUser = false;
    //         targetCommentResponse.comment.likeCount--;
    //       },
    //       error: (errorResponse: HttpErrorResponse) => {
    //         this.matSnackbar.openFromComponent(SnackbarComponent, {
    //           data: AppConstants.snackbarErrorContent,
    //           panelClass: ['bg-danger'],
    //           duration: 5000
    //         });
    //       }
    //     })
    //   );
    // } else {
    //   this.subscriptions.push(
    //     this.commentService.likeComment(commentResponse.comment.id).subscribe({
    //       next: (response: any) => {
    //         const targetCommentResponse = this.commentResponseList.find(cR => cR === commentResponse);
    //         targetCommentResponse.likedByAuthUser = true;
    //         targetCommentResponse.comment.likeCount++;
    //       },
    //       error: (errorResponse: HttpErrorResponse) => {
    //         this.matSnackbar.openFromComponent(SnackbarComponent, {
    //           data: AppConstants.snackbarErrorContent,
    //           panelClass: ['bg-danger'],
    //           duration: 5000
    //         });
    //       }
    //     })
    //   );
    // }
  }

  openCommentDeleteConfirmDialog(commentResponse: CommentResponse): void {
    const dialogRef = this.matDialog.open(ConfirmationDialogComponent, {
      data: 'Do you want to delete this comment permanently?',
      autoFocus: false,
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(
      result => {
        if (result) this.deleteComment(commentResponse);
      }
    );
  }

  private deleteComment(commentResponse: CommentResponse) {
    // this.subscriptions.push(
    //   this.commentService.deleteComment(this.dataPost.id, commentResponse.comment.id).subscribe({
    //     next: (response: any) => {
    //       const targetIndex = this.commentResponseList.indexOf(commentResponse);
    //       this.commentResponseList.splice(targetIndex, 1);
    //       this.dataPost.commentCount--;
    //
    //       this.matSnackbar.openFromComponent(SnackbarComponent, {
    //         data: 'Comment deleted successfully.',
    //         duration: 5000
    //       });
    //     },
    //     error: (errorResponse: HttpErrorResponse) => {
    //       this.matSnackbar.openFromComponent(SnackbarComponent, {
    //         data: AppConstants.snackbarErrorContent,
    //         panelClass: ['bg-danger'],
    //         duration: 5000
    //       });
    //     }
    //   })
    // );
  }


}

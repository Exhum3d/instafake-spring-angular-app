package org.victor.server.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.victor.server.entity.Comment;
import org.victor.server.entity.Post;
import org.victor.server.entity.User;
import org.victor.server.exception.EmptyPostException;
import org.victor.server.response.CommentResponse;
import org.victor.server.response.PostResponse;
import org.victor.server.service.CommentService;
import org.victor.server.service.PostService;
import org.victor.server.service.UserService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;
    private final CommentService commentService;
    private final UserService userService;

    @PostMapping("/posts/create")
    public ResponseEntity<?> createNewPost(
            @RequestParam(value = "text", required = false) Optional<String> content,
            @RequestParam(name = "image", required = false) Optional<MultipartFile> postPhoto
    ) throws JsonProcessingException {
       /* if ((content.isEmpty() || (content.get().length() == 0)) &&
                (postPhoto.isEmpty() || (postPhoto.get().getSize() <= 0))) {
            throw new EmptyPostException();
        }*/

        System.out.println(content.get());
        System.out.println(postPhoto.toString());
        String contentToAdd = content.isEmpty() ? null : content.get();
        MultipartFile postPhotoToAdd = postPhoto.isEmpty() ? null : postPhoto.get();

        Post createdPost = postService.createNewPost(contentToAdd, postPhotoToAdd);
        return new ResponseEntity<>(createdPost, HttpStatus.CREATED);
    }

    @PostMapping("/posts/{postId}/update")
    public ResponseEntity<?> updatePost(@PathVariable("postId") Long postId,
                                        @RequestParam(value = "text", required = false) Optional<String> content,
                                        @RequestParam(name = "image", required = false) Optional<MultipartFile> postPhoto
    ) throws JsonProcessingException {
        if ((content.isEmpty() || content.get().length() <= 0) &&
                (postPhoto.isEmpty() || postPhoto.get().getSize() <= 0)) {
            throw new EmptyPostException();
        }

        String contentToAdd = content.isEmpty() ? null : content.get();
        MultipartFile postImageToAdd = postPhoto.isEmpty() ? null : postPhoto.get();

        Post updatePost = postService.updatePost(postId, contentToAdd, postImageToAdd);
        return new ResponseEntity<>(updatePost, HttpStatus.OK);
    }

    @PostMapping("/posts/{postId}/delete")
    public ResponseEntity<?> deletePost(@PathVariable("postId") Long postId) {
        postService.deletePost(postId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/posts/{postId}/photo/delete")
    public ResponseEntity<?> deletePostPhoto(@PathVariable("postId") Long postId) {
        postService.deletePostPhoto(postId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/posts/{postId}")
    public ResponseEntity<?> getPostById(@PathVariable("postId") Long postId) {
        PostResponse foundPostResponse = postService.getPostResponseById(postId);
        return new ResponseEntity<>(foundPostResponse, HttpStatus.OK);
    }

    @GetMapping("/posts/{postId}/likes")
    public ResponseEntity<?> getPostLikes(@PathVariable("postId") Long postId,
                                          @RequestParam("page") Integer page,
                                          @RequestParam("size") Integer size) {
        page = page < 0 ? 0 : page - 1;
        size = size <= 0 ? 5 : size;
        Post targetPost = postService.getPostById(postId);
        List<User> postLikerList = userService.getLikesByPost(targetPost, page, size);
        return new ResponseEntity<>(postLikerList, HttpStatus.OK);
    }

    @PostMapping("/posts/{postId}/like")
    public ResponseEntity<?> likePost(@PathVariable("postId") Long postId) {
        postService.likePost(postId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/posts/{postId}/unlike")
    public ResponseEntity<?> unlikePost(@PathVariable("postId") Long postId) {
        postService.unlikePost(postId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<?> getPostComments(@PathVariable("postId") Long postId,
                                             @RequestParam("page") Integer page,
                                             @RequestParam("size") Integer size) {
        page = page < 0 ? 0 : page - 1;
        size = size <= 0 ? 5 : size;
        Post targetPost = postService.getPostById(postId);
        List<CommentResponse> postCommentResponseList = commentService.getPostCommentsPaginate(targetPost, page, size);
        return new ResponseEntity<>(postCommentResponseList, HttpStatus.OK);
    }

    @PostMapping("/posts/{postId}/comments/create")
    public ResponseEntity<?> createPostComment(@PathVariable("postId") Long postId,
                                               @RequestParam(value = "content") String content) {
        Comment savedComment = postService.createPostComment(postId, content);
        CommentResponse commentResponse = CommentResponse.builder()
                .comment(savedComment)
                .likedByAuthUser(false)
                .build();
        return new ResponseEntity<>(commentResponse, HttpStatus.OK);
    }

    @PostMapping("/posts/{postId}/comments/{commentId}/update")
    public ResponseEntity<?> updatePostComment(@PathVariable("commentId") Long commentId,
                                               @PathVariable("postId") Long postId,
                                               @RequestParam(value = "content") String content) {
        Comment savedComment = postService.updatePostComment(commentId, postId, content);
        return new ResponseEntity<>(savedComment, HttpStatus.OK);
    }

    @PostMapping("/posts/{postId}/comments/{commentId}/delete")
    public ResponseEntity<?> deletePostComment(@PathVariable("commentId") Long commentId,
                                               @PathVariable("postId") Long postId) {
        postService.deletePostComment(commentId, postId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/posts/comments/{commentId}/like")
    public ResponseEntity<?> likePostComment(@PathVariable("commentId") Long commentId) {
        commentService.likeComment(commentId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/posts/comments/{commentId}/unlike")
    public ResponseEntity<?> unlikePostComment(@PathVariable("commentId") Long commentId) {
        commentService.unlikeComment(commentId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/posts/comments/{commentId}/likes")
    public ResponseEntity<?> getCommentLikeList(@PathVariable("commentId") Long commentId,
                                                @RequestParam("page") Integer page,
                                                @RequestParam("size") Integer size) {
        page = page < 0 ? 0 : page - 1;
        size = size <= 0 ? 5 : size;
        Comment targetComment = commentService.getCommentById(commentId);
        List<User> commentLikes = userService.getLikesByComment(targetComment, page, size);
        return new ResponseEntity<>(commentLikes, HttpStatus.OK);
    }
}

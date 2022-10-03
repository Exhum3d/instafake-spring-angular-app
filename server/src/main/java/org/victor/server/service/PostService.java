package org.victor.server.service;

import org.springframework.web.multipart.MultipartFile;
import org.victor.server.entity.Comment;
import org.victor.server.entity.Post;
import org.victor.server.entity.User;
import org.victor.server.response.PostResponse;

import java.util.List;

public interface PostService {
    Post getPostById(Long postId);

    PostResponse getPostResponseById(Long postId);

    List<PostResponse> getPostsByUserPaginate(User author, Integer page, Integer size);

    List<PostResponse> getFeedPostsPaginate(Integer page, Integer size);

    Post createNewPost(String content, MultipartFile postPhoto);

    Post updatePost(Long postId, String content, MultipartFile postPhoto);

    void deletePost(Long postId);

    void deletePostPhoto(Long postId);

    void likePost(Long postId);

    void unlikePost(Long postId);

    Comment createPostComment(Long postId, String content);

    Comment updatePostComment(Long commentId, Long postId, String content);

    void deletePostComment(Long commentId, Long postId);
}

package org.victor.server.service;

import org.victor.server.entity.Comment;
import org.victor.server.entity.Post;
import org.victor.server.response.CommentResponse;

import java.util.List;

public interface CommentService {
    Comment getCommentById(Long commentId);

    Comment createNewComment(String content, Post post);

    Comment updateComment(Long commentId, String content);

    Comment likeComment(Long commentId);

    Comment unlikeComment(Long commentId);

    void deleteComment(Long commentId);

    List<CommentResponse> getPostCommentsPaginate(Post post, Integer page, Integer size);

}

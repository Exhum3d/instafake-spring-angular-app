package org.victor.server.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.victor.server.entity.Comment;
import org.victor.server.entity.Post;
import org.victor.server.entity.User;
import org.victor.server.exception.CommentNotFoundException;
import org.victor.server.exception.InvalidOperationException;
import org.victor.server.repository.CommentRepository;
import org.victor.server.response.CommentResponse;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;
    private final UserService userService;

    @Override
    public Comment getCommentById(Long commentId) {
        return commentRepository.findById(commentId).orElseThrow(CommentNotFoundException::new);
    }

    @Override
    public Comment createNewComment(String content, Post post) {
        User authUser = userService.getAuthenticatedUser();
        Comment newComment = new Comment();
        newComment.setText(content);
        newComment.setAuthor(authUser);
        newComment.setPost(post);
        newComment.setLikeCount(0);
        newComment.setCreatedAt(new Date());
        newComment.setUpdatedAt(new Date());

        return commentRepository.save(newComment);
    }

    @Override
    public Comment updateComment(Long commentId, String content) {
        User authUser = userService.getAuthenticatedUser();
        Comment targetComment = getCommentById(commentId);
        if (targetComment.getAuthor().equals(authUser)) {
            targetComment.setText(content);
            targetComment.setUpdatedAt(new Date());

            return commentRepository.save(targetComment);
        } else {
            throw new InvalidOperationException();
        }
    }

    @Override
    public Comment likeComment(Long commentId) {
        User authUser = userService.getAuthenticatedUser();
        Comment targetComment = getCommentById(commentId);
        if (!targetComment.getLikeList().contains(authUser)) {
            targetComment.setLikeCount(targetComment.getLikeCount() + 1);
            targetComment.getLikeList().add(authUser);
            targetComment.setUpdatedAt(new Date());

            return commentRepository.save(targetComment);
        } else {
            throw new InvalidOperationException();
        }
    }

    @Override
    public Comment unlikeComment(Long commentId) {
        User authUser = userService.getAuthenticatedUser();
        Comment targetComment = getCommentById(commentId);
        if (targetComment.getLikeList().contains(authUser)) {
            targetComment.setLikeCount(targetComment.getLikeCount() - 1);
            targetComment.getLikeList().remove(authUser);
            targetComment.setUpdatedAt(new Date());

            return commentRepository.save(targetComment);
        } else {
            throw new InvalidOperationException();
        }
    }

    @Override
    public void deleteComment(Long commentId) {
        User authUser = userService.getAuthenticatedUser();
        Comment targetComment = getCommentById(commentId);
        if (targetComment.getAuthor().equals(authUser)) {
            commentRepository.deleteById(commentId);
        } else {
            throw new InvalidOperationException();
        }
    }

    @Override
    public List<CommentResponse> getPostCommentsPaginate(Post post, Integer page, Integer size) {
        User authUser = userService.getAuthenticatedUser();
        List<Comment> foundCommentList = commentRepository.findByPost(
                post,
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"))
        );

        List<CommentResponse> commentResponseList = new ArrayList<>();
        foundCommentList.forEach(comment -> {
            CommentResponse newCommentResponse = CommentResponse.builder()
                    .comment(comment)
                    .likedByAuthUser(comment.getLikeList().contains(authUser))
                    .build();
            commentResponseList.add(newCommentResponse);
        });

        return commentResponseList;
    }
}

package org.victor.server.service;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.victor.server.entity.Comment;
import org.victor.server.entity.Post;
import org.victor.server.entity.User;
import org.victor.server.exception.EmptyCommentException;
import org.victor.server.exception.InvalidOperationException;
import org.victor.server.exception.PostNotFoundException;
import org.victor.server.repository.PostRepository;
import org.victor.server.response.PostResponse;
import org.victor.server.util.FileNamingUtil;
import org.victor.server.util.FileUploadUtil;

import javax.transaction.Transactional;
import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {
    private final PostRepository postRepository;
    private final UserService userService;
    private final CommentService commentService;
    private final Environment environment;
    private final FileNamingUtil fileNamingUtil;
    private final FileUploadUtil fileUploadUtil;
    private final PostResponse postResponse;

    @Override
    public Post getPostById(Long postId) {
        return postRepository.findById(postId).orElseThrow(PostNotFoundException::new);
    }

    @Override
    public PostResponse getPostResponseById(Long postId) {
        User authUser = userService.getAuthenticatedUser();

        Post foundPost = getPostById(postId);

        return PostResponse.builder()
                .post(foundPost)
                .likedByAuthUser(foundPost.getLikeList().contains(authUser))
                .build();
    }

    @Override
    public List<PostResponse> getPostsByUserPaginate(User author, Integer page, Integer size) {
        return postRepository.findPostsByAuthor(
                        author,
                        PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")))
                .stream()
                .map(this::postToPostResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PostResponse> getFeedPostsPaginate(Integer page, Integer size) {
        User authUser = userService.getAuthenticatedUser();
        List<User> followingList = authUser.getFollowerUsers();
        followingList.add(authUser);
        List<Long> followingListIds = followingList.stream().map(User::getId).toList();
        return postRepository.findPostsByAuthorIdIn(
                        followingListIds,
                        PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "dateCreated")))
                .stream()
                .map(this::postToPostResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Post createNewPost(String content, MultipartFile postPhoto) {
        User authUser = userService.getAuthenticatedUser();
        Post newPost = new Post();
        newPost.setText(content);
        newPost.setAuthor(authUser);
        newPost.setLikeCount(0);
        newPost.setCommentCount(0);
        newPost.setCreatedAt(new Date());
        newPost.setUpdatedAt(new Date());

        if (postPhoto != null && postPhoto.getSize() > 0) {
            String uploadDir = environment.getProperty("upload.post.images");
            String newPhotoName = fileNamingUtil.nameFile(postPhoto);
            String newPhotoUrl = environment.getProperty("app.root.backend") + File.separator
                    + environment.getProperty("upload.post.images") + File.separator + newPhotoName;
            newPost.setImage(newPhotoUrl);
            try {
                fileUploadUtil.saveNewFile(uploadDir, newPhotoName, postPhoto);
            } catch (IOException e) {
                throw new RuntimeException();
            }
        }

        return postRepository.save(newPost);
    }

    @Override
    public Post updatePost(Long postId, String content, MultipartFile postPhoto) {
        Post targetPost = getPostById(postId);

        if (StringUtils.isNotEmpty(content)) {
            targetPost.setText(content);
        }

        if (postPhoto != null && postPhoto.getSize() > 0) {
            String uploadDir = environment.getProperty("upload.post.images");
            String oldPhotoName = getPhotoNameFromPhotoUrl(targetPost.getImage());
            String newPhotoName = fileNamingUtil.nameFile(postPhoto);
            String newPhotoUrl = environment.getProperty("app.root.backend") + File.separator
                    + environment.getProperty("upload.post.images") + File.separator + newPhotoName;
            targetPost.setImage(newPhotoUrl);
            try {
                if (oldPhotoName == null) {
                    fileUploadUtil.saveNewFile(uploadDir, newPhotoName, postPhoto);
                } else {
                    fileUploadUtil.updateFile(uploadDir, oldPhotoName, newPhotoName, postPhoto);
                }
            } catch (IOException e) {
                throw new RuntimeException();
            }
        }
        targetPost.setUpdatedAt(new Date());

        return postRepository.save(targetPost);
    }


    @Override
    public void deletePost(Long postId) {
        User authUser = userService.getAuthenticatedUser();
        Post targetPost = getPostById(postId);

        if (targetPost.getAuthor().equals(authUser)) {
            postRepository.deleteById(postId);

            if (targetPost.getImage() != null) {
                String uploadDir = environment.getProperty("upload.post.images");
                String photoName = getPhotoNameFromPhotoUrl(targetPost.getImage());
                try {
                    fileUploadUtil.deleteFile(uploadDir, photoName);
                } catch (IOException ignored) {
                }
            }
        } else {
            throw new InvalidOperationException();
        }
    }

    @Override
    public void deletePostPhoto(Long postId) {
        User authUser = userService.getAuthenticatedUser();
        Post targetPost = getPostById(postId);

        if (targetPost.getAuthor().equals(authUser)) {
            if (targetPost.getImage() != null) {
                String uploadDir = environment.getProperty("upload.post.images");
                String photoName = getPhotoNameFromPhotoUrl(targetPost.getImage());
                try {
                    fileUploadUtil.deleteFile(uploadDir, photoName);
                } catch (IOException ignored) {
                }
            }

            targetPost.setImage(null);
            postRepository.save(targetPost);
        } else {
            throw new InvalidOperationException();
        }

    }

    @Override
    public void likePost(Long postId) {
        User authUser = userService.getAuthenticatedUser();
        Post targetPost = getPostById(postId);
        if (!targetPost.getLikeList().contains(authUser)) {
            targetPost.setLikeCount(targetPost.getLikeCount() + 1);
            targetPost.getLikeList().add(authUser);
            postRepository.save(targetPost);
        } else {
            throw new InvalidOperationException();
        }
    }

    @Override
    public void unlikePost(Long postId) {
        User authUser = userService.getAuthenticatedUser();
        Post targetPost = getPostById(postId);
        if (targetPost.getLikeList().contains(authUser)) {
            targetPost.setLikeCount(targetPost.getLikeCount() - 1);
            targetPost.getLikeList().remove(authUser);
            postRepository.save(targetPost);
        } else {
            throw new InvalidOperationException();
        }
    }

    @Override
    public Comment createPostComment(Long postId, String content) {
        if (StringUtils.isEmpty(content)) throw new EmptyCommentException();

        User authUser = userService.getAuthenticatedUser();
        Post targetPost = getPostById(postId);
        Comment savedComment = commentService.createNewComment(content, targetPost);
        targetPost.setCommentCount(targetPost.getCommentCount() + 1);
        postRepository.save(targetPost);

        return savedComment;
    }

    @Override
    public Comment updatePostComment(Long commentId, Long postId, String content) {
        if (StringUtils.isEmpty(content)) throw new EmptyCommentException();

        return commentService.updateComment(commentId, content);
    }

    @Override
    public void deletePostComment(Long commentId, Long postId) {
        Post targetPost = getPostById(postId);
        commentService.deleteComment(commentId);
        targetPost.setCommentCount(targetPost.getCommentCount() - 1);
        targetPost.setUpdatedAt(new Date());
        postRepository.save(targetPost);
    }

    private PostResponse postToPostResponse(Post post) {
        User authUser = userService.getAuthenticatedUser();
        return PostResponse.builder()
                .post(post)
                .likedByAuthUser(post.getLikeList().contains(authUser))
                .build();
    }

    private String getPhotoNameFromPhotoUrl(String photoUrl) {
        if (photoUrl != null) {
            String stringToOmit = environment.getProperty("app.root.backend") + File.separator
                    + environment.getProperty("upload.post.images") + File.separator;
            return photoUrl.substring(stringToOmit.length());
        } else {
            return null;
        }
    }
}

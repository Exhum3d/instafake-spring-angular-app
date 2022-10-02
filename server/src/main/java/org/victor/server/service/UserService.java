package org.victor.server.service;

import org.springframework.web.multipart.MultipartFile;
import org.victor.server.dto.SignUpDto;
import org.victor.server.entity.Comment;
import org.victor.server.entity.Post;
import org.victor.server.entity.User;

import java.util.List;

public interface UserService {

    User getUserById(Long userId);

    User getUserByEmail(String email);

    User createUser(SignUpDto signUpDto);

    User updateProfileImage(MultipartFile image);

    void followUser(Long userId);

    void unfollowUser(Long userId);

    List<User> getLikesByPost(Post post, Integer page, Integer size);

    List<User> getLikesByComment(Comment comment, Integer page, Integer size);
}

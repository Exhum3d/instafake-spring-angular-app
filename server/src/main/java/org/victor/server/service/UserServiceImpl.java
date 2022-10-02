package org.victor.server.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.victor.server.dto.SignUpDto;
import org.victor.server.entity.Comment;
import org.victor.server.entity.Post;
import org.victor.server.entity.Role;
import org.victor.server.entity.User;
import org.victor.server.exception.EmailExistsException;
import org.victor.server.exception.UserNotFoundException;
import org.victor.server.repository.UserRepository;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public User getUserById(Long userId) {
        return userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(UserNotFoundException::new);
    }

    @Override
    public User createUser(SignUpDto signUpDto) {
        try {
            User user = getUserByEmail(signUpDto.getEmail());

            if (user != null) {
                throw new EmailExistsException();
            }
        } catch (UserNotFoundException e) {
            User newUser = new User();

            newUser.setFirstName(signUpDto.getFirstName());
            newUser.setLastName(signUpDto.getLastName());
            newUser.setEmail(signUpDto.getEmail());
            newUser.setPassword(passwordEncoder.encode(signUpDto.getPassword()));
            newUser.setFollowingCount(0);
            newUser.setFollowerCount(0);
            newUser.setCreatedAt(new Date());
            newUser.setUpdatedAt(new Date());
            newUser.setRole(Role.ROLE_USER.name());

            User savedUser = userRepository.save(newUser);
        }
        return null;
    }

    @Override
    public User updateProfileImage(MultipartFile image) {
        return null;
    }

    @Override
    public void followUser(Long userId) {

    }

    @Override
    public void unfollowUser(Long userId) {

    }

    @Override
    public List<User> getLikesByPost(Post post, Integer page, Integer size) {
        return null;
    }

    @Override
    public List<User> getLikesByComment(Comment comment, Integer page, Integer size) {
        return null;
    }
}

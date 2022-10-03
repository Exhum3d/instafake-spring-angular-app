package org.victor.server.service;

import lombok.RequiredArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.security.core.context.SecurityContextHolder;
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
import org.victor.server.shared.UserPrincipal;
import org.victor.server.util.FileNamingUtil;
import org.victor.server.util.FileUploadUtil;

import javax.transaction.Transactional;
import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final Environment environment;
    private final FileNamingUtil fileNamingUtil;
    private final FileUploadUtil fileUploadUtil;

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
                throw new EmailExistsException("email already exists");
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
            newUser.setEnabled(true);
            User savedUser = userRepository.save(newUser);
            UserPrincipal userPrincipal = new UserPrincipal(savedUser);
            return savedUser;
        }
        return null;
    }

    @Override
    public final User getAuthenticatedUser() {
        String authUserEmail = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        return getUserByEmail(authUserEmail);
    }

    @Override
    public User updateProfileImage(MultipartFile image) {
        User targetUser = getAuthenticatedUser();
        if (!image.isEmpty() && image.getSize() > 0) {
            String uploadDir = environment.getProperty("upload.user.images");
            String oldPhotoName = targetUser.getProfileImage();
            String newPhotoName = fileNamingUtil.nameFile(image);
            String newPhotoUrl = environment.getProperty("app.root.backend") + File.separator
                    + environment.getProperty("upload.user.images") + File.separator + newPhotoName;
            targetUser.setProfileImage(newPhotoUrl);
            try {
                if (oldPhotoName == null) {
                    fileUploadUtil.saveNewFile(uploadDir, newPhotoName, image);
                } else {
                    fileUploadUtil.updateFile(uploadDir, oldPhotoName, newPhotoName, image);
                }
            } catch (IOException e) {
                throw new RuntimeException();
            }
        }
        return userRepository.save(targetUser);
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

    private String getPhotoNameFromPhotoUrl(String photoUrl) {
        if (photoUrl != null) {
            String stringToOmit = environment.getProperty("app.root.backend") + File.separator
                    + environment.getProperty("upload.user.images") + File.separator;
            return photoUrl.substring(stringToOmit.length());
        } else {
            return null;
        }
    }
}

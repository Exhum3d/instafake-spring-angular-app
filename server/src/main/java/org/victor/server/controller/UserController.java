package org.victor.server.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.victor.server.dto.LoginDto;
import org.victor.server.dto.SignUpDto;
import org.victor.server.entity.User;
import org.victor.server.response.PostResponse;
import org.victor.server.response.UserResponse;
import org.victor.server.service.JwtTokenService;
import org.victor.server.service.PostService;
import org.victor.server.service.UserService;
import org.victor.server.shared.Constants;
import org.victor.server.shared.UserPrincipal;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final PostService postService;
    private final JwtTokenService jwtTokenService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody @Valid SignUpDto signUpDto) {
        User savedUser = userService.createUser(signUpDto);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginDto loginDto) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginDto.getEmail(), loginDto.getPassword())
        );
        User loginUser = userService.getUserByEmail(loginDto.getEmail());
        UserPrincipal userPrincipal = new UserPrincipal(loginUser);
        HttpHeaders newHttpHeaders = new HttpHeaders();
        newHttpHeaders.add(Constants.TOKEN_HEADER, jwtTokenService.generateToken(userPrincipal));
        return new ResponseEntity<>(loginUser, newHttpHeaders, HttpStatus.OK);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> showProfile(Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getPrincipal().toString());
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PostMapping("/account/update/profile-photo")
    public ResponseEntity<?> updateProfilePhoto(@RequestParam("profileImage") MultipartFile profileImage) {
        User updatedUser = userService.updateProfileImage(profileImage);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable("userId") Long userId) {
        User authUser = userService.getAuthenticatedUser();
        User targetUser = userService.getUserById(userId);
        UserResponse userResponse = UserResponse.builder()
                .user(targetUser)
                .followedByAuthUser(targetUser.getFollowerUsers().contains(authUser))
                .build();
        return new ResponseEntity<>(userResponse, HttpStatus.OK);
    }

    @GetMapping("/users/{userId}/posts")
    public ResponseEntity<?> getUserPosts(@PathVariable("userId") Long userId,
                                          @RequestParam("page") Integer page,
                                          @RequestParam("size") Integer size) {
        page = page < 0 ? 0 : page - 1;
        size = size <= 0 ? 5 : size;

        User targetUser = userService.getUserById(userId);
        List<PostResponse> userPosts = postService.getPostsByUserPaginate(targetUser, page, size);
        return new ResponseEntity<>(userPosts, HttpStatus.OK);
    }
}

package org.victor.server.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.victor.server.dto.SignUpDto;
import org.victor.server.entity.User;
import org.victor.server.service.PostService;
import org.victor.server.service.UserService;

import javax.validation.Valid;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final PostService postService;

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody @Valid SignUpDto signUpDto) {
        User savedUser = userService.createUser(signUpDto);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

}

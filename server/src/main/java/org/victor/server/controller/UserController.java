package org.victor.server.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.victor.server.service.UserService;

@RestController
@RequestMapping("/api")
public class UserController {

    public UserController(UserService userService) {
    }
}

package org.victor.server.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.victor.server.service.PostService;

@RestController
@RequestMapping("/api")
public class PostController {

    public PostController(PostService postService) {
    }
}

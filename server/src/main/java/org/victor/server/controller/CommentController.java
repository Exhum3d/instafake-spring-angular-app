package org.victor.server.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.victor.server.service.CommentService;

@RestController
@RequestMapping("/api")
public class CommentController {

    public CommentController(CommentService commentService) {
    }
}

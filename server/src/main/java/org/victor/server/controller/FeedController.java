package org.victor.server.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.victor.server.response.PostResponse;
import org.victor.server.service.PostService;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class FeedController {
    private final PostService postService;

    @GetMapping("/")
    public ResponseEntity<?> getFeedPosts(
            @RequestParam("page") Integer page,
            @RequestParam("size") Integer size) {

        page = page < 0 ? 0 : page - 1;
        size = size <= 0 ? 5 : size;
        List<PostResponse> timelinePosts = postService.getFeedPostsPaginate(page, size);
        return new ResponseEntity<>(timelinePosts, HttpStatus.OK);
    }
}

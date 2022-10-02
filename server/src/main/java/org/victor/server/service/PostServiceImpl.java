package org.victor.server.service;

import org.springframework.stereotype.Service;
import org.victor.server.repository.PostRepository;

@Service
public class PostServiceImpl implements PostService {

    public PostServiceImpl(PostRepository postRepository) {
    }
}

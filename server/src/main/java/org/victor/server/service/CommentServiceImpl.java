package org.victor.server.service;

import org.springframework.stereotype.Service;
import org.victor.server.repository.CommentRepository;

@Service
public class CommentServiceImpl implements CommentService {
    public CommentServiceImpl(CommentRepository commentRepository) {
    }
}

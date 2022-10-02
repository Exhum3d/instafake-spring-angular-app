package org.victor.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.victor.server.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {
}

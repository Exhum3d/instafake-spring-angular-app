package org.victor.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.victor.server.entity.Post;

public interface PostRepository extends JpaRepository<Post, Long> {
}

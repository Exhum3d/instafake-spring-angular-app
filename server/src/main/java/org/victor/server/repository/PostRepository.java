package org.victor.server.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.victor.server.entity.Post;
import org.victor.server.entity.User;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findPostsByAuthor(User author, Pageable pageable);

    List<Post> findPostsByAuthorIdIn(List<Long> followingUserIds, Pageable pageable);
}

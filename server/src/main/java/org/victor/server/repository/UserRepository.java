package org.victor.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.victor.server.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
}

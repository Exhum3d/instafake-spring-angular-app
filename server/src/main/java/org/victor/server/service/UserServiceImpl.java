package org.victor.server.service;

import org.springframework.stereotype.Service;
import org.victor.server.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {

    public UserServiceImpl(UserRepository userRepository) {
    }
}

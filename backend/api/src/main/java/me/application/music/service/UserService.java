package me.application.music.service;

import me.application.music.music_application.tables.pojos.User;
import me.application.music.repository.impl.UserReposotoryImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired private UserReposotoryImpl userReposotory;

    public List<User> findAll() {
        return userReposotory.findAll();
    }

    public User findById(String id) {
        return userReposotory.findById(id);
    }

    public Integer create(User user) {
        return userReposotory.createOne(user);
    }

    public Integer update(User user) {
        return userReposotory.update(user);
    }

    public Integer delete(String id) {
        return userReposotory.delete(id);
    }

    public User findByUsername(String username) {
        return userReposotory.findByUsername(username);
    }

    public Integer setRole(String id, Long roleId) {
        return userReposotory.setRole(id, roleId);
    }
}

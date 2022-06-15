package me.application.music.service;

import lombok.SneakyThrows;
import me.application.music.dto.UserRequest;
import me.application.music.music_application.tables.pojos.User;
import me.application.music.repository.impl.UserReposotoryImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Objects;

@Service
public class UserService {

    private final Path root = Paths.get("resources");

    @Autowired private UserReposotoryImpl userReposotory;

    public List<User> findAll() {
        return userReposotory.findAll();
    }

    public User findById(String id) {
        return userReposotory.findById(id);
    }

    public User update(UserRequest userRequest) {
        User user = this.toUser(userRequest);
        userReposotory.update(user);
        return user;
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

    @SneakyThrows
    private User toUser(UserRequest userRequest) {
        User user = userReposotory.findById(String.valueOf(userRequest.getId()));
        user.setFirstName(userRequest.getFirstName());
        user.setLastName(userRequest.getLastName());
        user.setUsername(userRequest.getUsername());
        try {
            Path path = this.root.resolve("avatars/" + Objects.requireNonNull(userRequest.getAvatar().getOriginalFilename()));
            Files.copy(userRequest.getAvatar().getInputStream(), path);
            user.setAvatar(UriComponentsBuilder.fromPath(userRequest.getAvatar().getOriginalFilename()).build().encode().toString());
        } catch (Exception e) {
            user.setAvatar("default.png");
        }
        return user;
    }

    public Resource loadImage(String imageName) {
        try {
            Path file = root.resolve("avatars/" + imageName);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Could not read the file!");
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }
}

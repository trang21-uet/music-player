package me.application.music.controller;

import me.application.music.dto.UserRequest;
import me.application.music.music_application.tables.pojos.User;
import me.application.music.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {

    @Autowired private UserService userService;

    @GetMapping("/users")
    public ResponseEntity<?> findById(@RequestParam(required = false, defaultValue = "") String id,
                                         @RequestParam(required = false, defaultValue = "") String username) {
        if(id.equals("")) {
            if(username.equals("")) {
                return ResponseEntity.ok(userService.findAll());
            } else {
                return ResponseEntity.ok(userService.findByUsername(username));
            }
        } else {
            return ResponseEntity.ok(userService.findById(id));
        }
    }

    @PutMapping("/users")
    public ResponseEntity<Integer> updateUser(@RequestBody UserRequest user) {
        return ResponseEntity.ok(userService.update(user));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Integer> deleteUser(@PathVariable String id) {
        return ResponseEntity.ok(userService.delete(id));
    }

    @PutMapping("/role")
    public ResponseEntity<Integer> setRoleUser(@RequestParam String id, @RequestParam Long roleId) {
        return ResponseEntity.ok(userService.setRole(id, roleId));
    }

    @GetMapping("avatars/{avatar}")
    public ResponseEntity<Resource> getAvatar(@PathVariable String avatar) {
        Resource file = userService.loadImage(avatar);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + file.getFilename() + "\"").body(file);
    }

}

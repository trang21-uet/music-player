package me.application.music.authenticate.model;

import lombok.Data;
import me.application.music.music_application.tables.pojos.Authenticate;
import me.application.music.music_application.tables.pojos.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class JwtResponse {
    private String token;
    private List<String> role;

    private String username;
    private Long   id;
    private String firstName;
    private String lastName;
    private String avatar;

    public JwtResponse(String token,
                       Authenticate authenticate,
                       Collection<? extends GrantedAuthority> roles,
                       User user) {
        this.username = authenticate.getUsername();
        this.token = token;
        this.role = roles.stream().map(roleItem -> {
            return roleItem.getAuthority();
        }).collect(Collectors.toList());

        this.id = user.getId();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.avatar = user.getAvatar();
    }
}

package me.application.music.authenticate.model;

import lombok.Data;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

@Data
public class JwtResponse {
    private String username;
    private String token;
    private Collection<? extends GrantedAuthority> role;

    public JwtResponse(String token, String username, Collection<? extends GrantedAuthority> role) {
        this.username = username;
        this.token = token;
        this.role = role;
    }
}

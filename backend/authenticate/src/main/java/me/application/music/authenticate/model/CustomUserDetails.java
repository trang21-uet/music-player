package me.application.music.authenticate.model;

import lombok.Data;
import me.application.music.music_application.tables.pojos.Authenticate;
import me.application.music.music_application.tables.pojos.Role;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Objects;

@Data
public class CustomUserDetails implements UserDetails {

    private Authenticate authenticate;

    private Collection<? extends GrantedAuthority> roles;

    public CustomUserDetails(Authenticate authenticate,
                             Collection<? extends GrantedAuthority> roles) {
        this.authenticate = authenticate;
        this.roles = roles;
    }

    public static CustomUserDetails build(Authenticate authenticate, Role role) {
        List<GrantedAuthority> list = new ArrayList<>();
        list.add(new SimpleGrantedAuthority(role.getRole()));
        return new CustomUserDetails(
                authenticate,
                list
        );
    }

    public Long getId() {
        return authenticate.getId();
    }

    @Override
    public String getPassword() {
        return authenticate.getPassword();
    }

    @Override
    public String getUsername() {
        return authenticate.getUsername();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles;
    }


    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        CustomUserDetails user = (CustomUserDetails) o;
        return Objects.equals(this.getId(), user.getId());
    }

    @Override
    public int hashCode() {
        return super.hashCode();
    }
}

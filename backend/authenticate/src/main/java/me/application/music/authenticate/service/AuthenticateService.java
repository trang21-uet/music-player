package me.application.music.authenticate.service;

import me.application.music.authenticate.model.CustomUserDetails;
import me.application.music.music_application.tables.pojos.Authenticate;
import me.application.music.music_application.tables.pojos.Role;
import me.application.music.music_application.tables.pojos.User;
import me.application.music.repository.impl.AuthenticateRepositoryImpl;
import me.application.music.repository.impl.RoleRepositoryImpl;
import me.application.music.repository.impl.UserReposotoryImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthenticateService implements UserDetailsService {
    @Autowired private AuthenticateRepositoryImpl authenticateRepository;
    @Autowired private UserReposotoryImpl userReposotory;
    @Autowired private RoleService roleService;

    @Autowired private PasswordEncoder passwordEncoder;

    public List<Authenticate> findAll() {
        return authenticateRepository.findAll();
    }

    public Authenticate findById(String id) {
        return authenticateRepository.findById(id);
    }

    public Integer create(Authenticate authenticate) {
        authenticate.setPassword(passwordEncoder.encode(authenticate.getPassword()));
        User user = new User();
        user.setLastName("Guest");
        user.setUsername(authenticate.getUsername());
        user.setRoleId(1L);
        user.setAvatar("default.png");
        return authenticateRepository.createOne(authenticate) + userReposotory.createOne(user);
    }

    public Integer delete(String id) {
        return authenticateRepository.delete(id);
    }

    public Authenticate findByUsername(String username) {
        return authenticateRepository.findByUsername(username);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Authenticate authenticate = authenticateRepository.findByUsername(username);
        User user = userReposotory.findByUsername(username);
        Role role = roleService.findById(String.valueOf(user.getRoleId()));
        if (authenticate == null) {
            throw new UsernameNotFoundException(username);
        }
        return CustomUserDetails.build(authenticate, role, user);
    }
}

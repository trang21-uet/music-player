package me.application.music.controller;

import me.application.music.authenticate.model.JwtResponse;
import me.application.music.authenticate.service.AuthenticateService;
import me.application.music.authenticate.util.JwtTokenProvider;
import me.application.music.music_application.tables.pojos.Authenticate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthenticateController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired private JwtTokenProvider jwtProvider;

    @Autowired private AuthenticateService authenticateService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Authenticate authenticate) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authenticate.getUsername(), authenticate.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtProvider.generateTokenLogin(authentication);
        UserDetails authenticateDetails = (UserDetails) authentication.getPrincipal();
//        Authenticate currentUser = authenticateService.findByUsername(authenticate.getUsername());
        return ResponseEntity.ok(new JwtResponse(jwt, authenticateDetails.getUsername(), authenticateDetails.getAuthorities()));
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@RequestBody Authenticate authenticate) {
        authenticateService.create(authenticate);
        return ResponseEntity.ok("Created Success");
    }
}

package com.timidtlk.observatorio.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.timidtlk.observatorio.domain.user.AuthenticationDTO;
import com.timidtlk.observatorio.domain.user.LoginResponseDTO;
import com.timidtlk.observatorio.domain.user.RegisterDTO;
import com.timidtlk.observatorio.domain.user.User;
import com.timidtlk.observatorio.infra.security.TokenService;
import com.timidtlk.observatorio.repository.UserRepository;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private AuthenticationManager authenticationManager;
    private TokenService tokenService;
    private UserRepository userRepository;
    private PasswordEncoder encoder;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid AuthenticationDTO data) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.login(), data.password());
        var auth = authenticationManager.authenticate(usernamePassword);

        var token = tokenService.generateToken((User) auth.getPrincipal());

        return ResponseEntity.ok(new LoginResponseDTO(token));
    }

    @SuppressWarnings("rawtypes")
    @PostMapping("/register")
    public ResponseEntity register(@RequestBody @Valid RegisterDTO data) {
        if (userRepository.findByLogin(data.login()) != null) return ResponseEntity.badRequest().build();

        String encryptedPassword = encoder.encode(data.password());
        User user = new User(data.login(), encryptedPassword, data.role());

        userRepository.save(user);

        return ResponseEntity.ok().build();
    }
}

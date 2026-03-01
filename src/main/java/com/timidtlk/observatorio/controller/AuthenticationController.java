package com.timidtlk.observatorio.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.timidtlk.observatorio.domain.member.Member;
import com.timidtlk.observatorio.domain.user.AuthenticationDTO;
import com.timidtlk.observatorio.domain.user.ForgotPasswordRequestDTO;
import com.timidtlk.observatorio.domain.user.LoginResponseDTO;
import com.timidtlk.observatorio.domain.user.RegisterDTO;
import com.timidtlk.observatorio.domain.user.ResetPasswordRequestDTO;
import com.timidtlk.observatorio.infra.security.TokenService;
import com.timidtlk.observatorio.repository.MemberRepository;
import com.timidtlk.observatorio.service.PasswordResetService;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    TokenService tokenService;
    @Autowired
    MemberRepository repository;
    @Autowired
    PasswordEncoder encoder;
    @Autowired
    PasswordResetService passwordResetService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid AuthenticationDTO data) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.login(), data.password());
        var auth = authenticationManager.authenticate(usernamePassword);

        var token = tokenService.generateToken((Member) auth.getPrincipal());
        
        return ResponseEntity.ok(new LoginResponseDTO(token));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@RequestBody @Valid ForgotPasswordRequestDTO data) {
        passwordResetService.requestReset(data.loginOrEmail());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@RequestBody @Valid ResetPasswordRequestDTO data) {
        passwordResetService.resetPassword(data.loginOrEmail(), data.code(), data.newPassword());
        return ResponseEntity.noContent().build();
    }

    @SuppressWarnings("rawtypes")
    @PostMapping("/register")
    public ResponseEntity register(@RequestBody @Valid RegisterDTO data) {
        if (repository.findByLogin(data.login()) != null) return ResponseEntity.badRequest().build();

        String encryptedPassword = encoder.encode(data.password());
        Member user = new Member(data.login(), encryptedPassword, data.role());

        repository.save(user);

        return ResponseEntity.ok().build();
    }
}

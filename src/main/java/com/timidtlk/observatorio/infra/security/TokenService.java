package com.timidtlk.observatorio.infra.security;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.timidtlk.observatorio.domain.member.Member;

@Service
public class TokenService {
    @Value("${api.security.token.secret}")
    private String secret;

    public String generateToken(Member member) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            String token = JWT.create()
                    .withIssuer("observatorio-pnaes")
                    .withSubject(member.getLogin())
                    .withExpiresAt(genExpirationDate())
                    .sign(algorithm);
            return token;
        } catch (JWTCreationException e) {
            throw new RuntimeException("Error while generating token", e);
        }
    }

    public String validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                    .withIssuer("observatorio-pnaes")
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException e) {
            // retorna null quando inválido (mais claro que string vazia)
            return null;
        }
    }

    private Instant genExpirationDate() {
        return LocalDateTime.now().plusDays(365).toInstant(ZoneOffset.of("-03:00"));
    }
}

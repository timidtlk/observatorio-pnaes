package com.timidtlk.observatorio.infra.security;

import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.timidtlk.observatorio.domain.member.Member;
import com.timidtlk.observatorio.repository.MemberRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SecurityFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(SecurityFilter.class);

    @Autowired
    private TokenService tokenService;
    @Autowired
    private MemberRepository memberRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Skip preflight requests
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = recoverToken(request);
        if (token != null) {
            try {
                String subject = tokenService.validateToken(token);
                if (subject != null && !subject.isBlank()) {
                    Member member = memberRepository.findByLogin(subject).orElse(null);
                    if (member != null) {
                        UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(member, null, member.getAuthorities());
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        logger.debug("Authentication set with member {}", member.getLogin());
                    }
                }
            } catch (Exception ex) {
                logger.warn("Token validation failed: {}", ex.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }

    private String recoverToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null) return null;
        authHeader = authHeader.trim();
        if (!authHeader.toLowerCase().startsWith("bearer ")) return null;
        return authHeader.substring(7).trim();
    }
}

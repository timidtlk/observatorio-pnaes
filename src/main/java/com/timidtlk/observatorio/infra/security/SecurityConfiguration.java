package com.timidtlk.observatorio.infra.security;

import java.util.List;

import static org.springframework.http.HttpHeaders.ACCEPT;
import static org.springframework.http.HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS;
import static org.springframework.http.HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN;
import static org.springframework.http.HttpHeaders.ACCESS_CONTROL_REQUEST_HEADERS;
import static org.springframework.http.HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.HttpHeaders.CONTENT_TYPE;
import static org.springframework.http.HttpHeaders.ORIGIN;
import static org.springframework.http.HttpMethod.DELETE;
import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.HttpMethod.OPTIONS;
import static org.springframework.http.HttpMethod.PATCH;
import static org.springframework.http.HttpMethod.POST;
import static org.springframework.http.HttpMethod.PUT;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import com.timidtlk.observatorio.service.AuthorizationService;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
    @Autowired
    private SecurityFilter securityFilter;
    @Autowired
    private AuthorizationService authorizationService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .userDetailsService(authorizationService)
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                    .requestMatchers(POST, "/auth/login").permitAll()
                    .requestMatchers(POST, "/auth/register").hasRole("ADMIN")
                    .requestMatchers(POST, "/members").hasRole("ADMIN")
                    .requestMatchers(DELETE, "/members").hasRole("ADMIN")
                    .requestMatchers(PUT, "/members").authenticated()
                    .requestMatchers(GET, "/members").permitAll()
                    .requestMatchers(GET, "/members/image/**").permitAll()
                    .requestMatchers(POST, "/posts").authenticated()
                    .requestMatchers(DELETE, "/posts").authenticated()
                    .requestMatchers(PUT, "/posts").authenticated()
                    .requestMatchers(GET, "/posts").permitAll()
                )
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public CorsFilter corsFilter(){
        var urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
        var corsConfiguration = new CorsConfiguration();

        corsConfiguration.setAllowCredentials(true);
        corsConfiguration.setAllowedOrigins(List.of("http://localhost:5173"));
        corsConfiguration.setAllowedHeaders(
            List.of(
                ORIGIN, 
                ACCESS_CONTROL_ALLOW_ORIGIN, 
                CONTENT_TYPE, 
                ACCEPT, 
                AUTHORIZATION, 
                "X-Requested-With", 
                ACCESS_CONTROL_REQUEST_METHOD, 
                ACCESS_CONTROL_REQUEST_HEADERS, 
                ACCESS_CONTROL_ALLOW_CREDENTIALS
            )
        );
        corsConfiguration.setExposedHeaders(
            List.of(
                ORIGIN, 
                ACCESS_CONTROL_ALLOW_ORIGIN, 
                CONTENT_TYPE, 
                ACCEPT, 
                AUTHORIZATION, 
                "X-Requested-With", 
                ACCESS_CONTROL_REQUEST_METHOD, 
                ACCESS_CONTROL_REQUEST_HEADERS, 
                ACCESS_CONTROL_ALLOW_CREDENTIALS
            )
        );
        corsConfiguration.setAllowedMethods(List.of(GET.name(), POST.name(), PUT.name(), PATCH.name(), DELETE.name(), OPTIONS.name()));

        urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", corsConfiguration);
        return new CorsFilter(urlBasedCorsConfigurationSource);
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}

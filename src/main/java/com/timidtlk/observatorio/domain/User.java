package com.timidtlk.observatorio.domain;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.UuidGenerator;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.timidtlk.observatorio.enums.Role;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {
    @Id
    @UuidGenerator
    @Column(nullable = false, updatable = false, unique = true)
    private UUID id;
    @Column(nullable = false, unique = true)
    private String login;
    @Column(nullable = false)
    private String password;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
    @OneToOne
    private Member member;
    
    public User(String login, String password, Role role) {
        this.login = login;
        this.password = password;
        this.role = role;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return switch (this.role) {
            case Role.ADMIN:
                yield List.of(
                    new SimpleGrantedAuthority("ROLE_ADMIN"), 
                    new SimpleGrantedAuthority("ROLE_MEMBER"), 
                    new SimpleGrantedAuthority("ROLE_GUEST")
                );
            case Role.MEMBER:
                yield List.of(
                    new SimpleGrantedAuthority("ROLE_MEMBER"), 
                    new SimpleGrantedAuthority("ROLE_GUEST")
                );
            case Role.GUEST:
                yield List.of(new SimpleGrantedAuthority("ROLE_GUEST"));
        };
    }

    @Override
    public String getUsername() {
        return login;
    }
}

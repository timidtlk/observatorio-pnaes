package com.timidtlk.observatorio.domain.member;

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
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "members")
public class Member implements UserDetails {
    @Id
    @UuidGenerator
    @Column(name = "id", unique = true, updatable = false, nullable = false)
    private UUID id;
    private String name;
    @Column(length = 1000000)
    private String description;
    private String email;
    private String lattes;

    @Column(nullable = false, unique = true)
    private String login;
    @Column(nullable = false)
    private String password;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "photoUrl")
    private String photoUrl;

    public Member(String login, String password, Role role) {
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
                    new SimpleGrantedAuthority("ROLE_MEMBER")
                );
            case Role.MEMBER:
                yield List.of(
                    new SimpleGrantedAuthority("ROLE_MEMBER")
                );
        };
    }

    @Override
    public String getUsername() {
        return login;
    }
}

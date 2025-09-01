package com.timidtlk.observatorio.domain;

import java.util.UUID;

import org.hibernate.annotations.UuidGenerator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
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
public class Member {
    @Id
    @UuidGenerator
    @Column(name = "id", unique = true, updatable = false)
    private UUID id;
    private String name;
    @Lob
    @Column(length = 1000000)
    private String description;
    private String email;
    private String lattes;
    private String photoUrl;
}

package com.timidtlk.observatorio.domain.member;

import java.util.UUID;

import com.timidtlk.observatorio.enums.Role;

public record UpdateMemberDTO(
    UUID id,
    String name,
    String email,
    String login,
    String description,
    String lattes,
    Role role,
    Boolean showAbout
) {}

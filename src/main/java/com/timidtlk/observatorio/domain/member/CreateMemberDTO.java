package com.timidtlk.observatorio.domain.member;

import com.timidtlk.observatorio.enums.Role;

public record CreateMemberDTO(
    String name,
    String email,
    String login,
    String password,
    String description,
    String lattes,
    Role role,
    Boolean showAbout
) {}

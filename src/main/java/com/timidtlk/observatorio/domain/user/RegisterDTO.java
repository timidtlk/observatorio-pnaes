package com.timidtlk.observatorio.domain.user;

import com.timidtlk.observatorio.enums.Role;

public record RegisterDTO(String login, String password, Role role) {
}

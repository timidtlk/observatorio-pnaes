package com.timidtlk.observatorio.domain;

import com.timidtlk.observatorio.enums.Role;

public record RegisterDTO(String login, String password, Role role) {
}

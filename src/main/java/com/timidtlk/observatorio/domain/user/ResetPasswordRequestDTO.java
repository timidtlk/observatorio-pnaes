package com.timidtlk.observatorio.domain.user;

public record ResetPasswordRequestDTO(String loginOrEmail, String code, String newPassword) {
}

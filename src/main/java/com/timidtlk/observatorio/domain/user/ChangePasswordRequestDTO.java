package com.timidtlk.observatorio.domain.user;

public record ChangePasswordRequestDTO(String currentPassword, String newPassword, String confirmPassword) {
}

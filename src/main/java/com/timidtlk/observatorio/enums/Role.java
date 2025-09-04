package com.timidtlk.observatorio.enums;

public enum Role {
    GUEST("Guest"),
    MEMBER("Member"),
    ADMIN("Admin");

    private String name;

    private Role(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}

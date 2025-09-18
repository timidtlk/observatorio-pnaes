package com.timidtlk.observatorio.enums;

public enum Role {
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

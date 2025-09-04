package com.timidtlk.observatorio.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.timidtlk.observatorio.domain.Member;

public interface MemberRepository extends JpaRepository<Member, UUID> {
    Optional<Member> findByName(String name);
}

package com.timidtlk.observatorio.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.timidtlk.observatorio.domain.member.Member;

@Repository
public interface MemberRepository extends JpaRepository<Member, UUID> {
    Optional<Member> findByName(String name);
    Optional<Member> findByLogin(String login);
    Optional<Member> findByEmail(String email);
}

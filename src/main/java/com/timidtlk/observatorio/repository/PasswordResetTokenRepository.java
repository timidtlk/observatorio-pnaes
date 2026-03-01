package com.timidtlk.observatorio.repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.timidtlk.observatorio.domain.member.Member;
import com.timidtlk.observatorio.domain.user.PasswordResetToken;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, UUID> {
    @Query("SELECT t FROM PasswordResetToken t WHERE t.member = :member AND t.used = false AND t.expiresAt > :now ORDER BY t.createdAt DESC")
    Optional<PasswordResetToken> findActiveByMember(Member member, LocalDateTime now);

    Optional<PasswordResetToken> findByMemberAndCode(Member member, String code);
}

package com.timidtlk.observatorio.service;

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.timidtlk.observatorio.domain.member.Member;
import com.timidtlk.observatorio.domain.user.PasswordResetToken;
import com.timidtlk.observatorio.repository.MemberRepository;
import com.timidtlk.observatorio.repository.PasswordResetTokenRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@Transactional
public class PasswordResetService {
    private static final int CODE_LENGTH = 6;
    private static final int EXPIRATION_MINUTES = 15;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public void requestReset(String loginOrEmail) {
        Member member = findMember(loginOrEmail);
        String code = generateCode();

        PasswordResetToken token = PasswordResetToken.builder()
            .member(member)
            .code(code)
            .createdAt(LocalDateTime.now())
            .expiresAt(LocalDateTime.now().plusMinutes(EXPIRATION_MINUTES))
            .used(false)
            .build();

        tokenRepository.save(token);
        sendCodeEmail(member, code);
        log.info("Password reset code generated for user {}", member.getLogin());
    }

    public void resetPassword(String loginOrEmail, String code, String newPassword) {
        Member member = findMember(loginOrEmail);
        PasswordResetToken token = tokenRepository.findByMemberAndCode(member, code)
            .orElseThrow(() -> new IllegalArgumentException("Código inválido"));

        if (token.isUsed()) {
            throw new IllegalArgumentException("Código já utilizado");
        }
        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Código expirado");
        }

        member.setPassword(passwordEncoder.encode(newPassword));
        memberRepository.save(member);

        token.setUsed(true);
        tokenRepository.save(token);
    }

    private Member findMember(String loginOrEmail) {
        return memberRepository.findByLogin(loginOrEmail)
            .or(() -> memberRepository.findByEmail(loginOrEmail))
            .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
    }

    private String generateCode() {
        Random random = new Random();
        int number = random.nextInt((int) Math.pow(10, CODE_LENGTH));
        return String.format("%06d", number);
    }

    private void sendCodeEmail(Member member, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(member.getEmail());
        message.setSubject("Código para redefinição de senha");
        message.setText("Olá,\n\n" +
            "Seu código para redefinir a senha no Observatório é: " + code + "\n" +
            "Ele expira em " + EXPIRATION_MINUTES + " minutos.\n\n" +
            "Se você não solicitou, ignore esta mensagem.");
        mailSender.send(message);
    }
}

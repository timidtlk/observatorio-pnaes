package com.timidtlk.observatorio.service;

import static com.timidtlk.observatorio.utils.Constants.IMAGE_PATH;
import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.function.BiFunction;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.timidtlk.observatorio.domain.member.CreateMemberDTO;
import com.timidtlk.observatorio.domain.member.Member;
import com.timidtlk.observatorio.domain.member.UpdateMemberDTO;
import com.timidtlk.observatorio.enums.Role;
import com.timidtlk.observatorio.repository.MemberRepository;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@Transactional(rollbackOn = Exception.class)
public class MemberService {
    @Autowired
    MemberRepository memberRepo;

    @Autowired
    PasswordEncoder passwordEncoder;

    public List<Member> getAllMembers() {
        return memberRepo.findAll(Sort.by("name"));
    }

    public Member getMember(UUID id) {
        return memberRepo.findById(id).orElseThrow(() -> new RuntimeException("Member not found"));
    }

    public Member getMember(String login) {
        return memberRepo.findByLogin(login).orElseThrow(() -> new RuntimeException("Member not found"));
    }

    public Member createMember(Member member) {
        if (member.getPassword() != null && !member.getPassword().isBlank()) {
            member.setPassword(passwordEncoder.encode(member.getPassword()));
        }
        return memberRepo.save(member);
    }

    public Member createMember(CreateMemberDTO dto) {
        Member member = new Member();
        member.setName(dto.name());
        member.setEmail(dto.email());
        member.setLogin(dto.login());
        member.setDescription(dto.description());
        member.setLattes(dto.lattes());
        member.setRole(dto.role() == null ? Role.MEMBER : dto.role());
        member.setShowAbout(dto.showAbout() == null ? true : dto.showAbout());
        member.setPassword(passwordEncoder.encode(dto.password()));
        return memberRepo.save(member);
    }

    public void deleteMember(Member member) {
        memberRepo.delete(member);
    }

    public Member updateMember(UpdateMemberDTO dto) {
        Member member = getMember(dto.id());
        if (dto.name() != null) member.setName(dto.name());
        if (dto.email() != null) member.setEmail(dto.email());
        if (dto.description() != null) member.setDescription(dto.description());
        if (dto.lattes() != null) member.setLattes(dto.lattes());
        if (dto.login() != null) member.setLogin(dto.login());
        if (dto.role() != null) member.setRole(dto.role());
        if (dto.showAbout() != null) member.setShowAbout(dto.showAbout());
        return memberRepo.save(member);
    }

    public Member updateOwnProfile(UUID id, UpdateMemberDTO dto) {
        Member member = getMember(id);
        if (dto.name() != null) member.setName(dto.name());
        if (dto.email() != null) member.setEmail(dto.email());
        if (dto.description() != null) member.setDescription(dto.description());
        if (dto.lattes() != null) member.setLattes(dto.lattes());
        if (dto.showAbout() != null) member.setShowAbout(dto.showAbout());
        return memberRepo.save(member);
    }

    public void changePassword(Member member, String currentPassword, String newPassword) {
        if (!passwordEncoder.matches(currentPassword, member.getPassword())) {
            throw new IllegalArgumentException("Senha atual incorreta");
        }
        member.setPassword(passwordEncoder.encode(newPassword));
        memberRepo.save(member);
    }

    public String uploadPhoto(UUID id, MultipartFile file) {
        log.info("Saving picture for user ID: {}", id);
        Member member = getMember(id);
        String photoUrl = photoFunction.apply(id.toString(), file);
        member.setPhotoUrl(photoUrl);
        memberRepo.save(member);
        
        return photoUrl;
    }

    private final Function<String, String> fileExtension = filename -> Optional.of(filename)
        .filter(name -> name.contains("."))
        .map(name -> "." + name.substring(filename.lastIndexOf(".") + 1))
        .orElse((".png"));

    private final BiFunction<String, MultipartFile, String> photoFunction = (id, image) -> {
        String filename = id + fileExtension.apply(image.getOriginalFilename());
        try {
            Path fileStorageLocation = Paths.get(IMAGE_PATH).toAbsolutePath().normalize();
            if (!Files.exists(fileStorageLocation)) Files.createDirectories(fileStorageLocation);
            Files.copy(image.getInputStream(), fileStorageLocation.resolve(filename), REPLACE_EXISTING);
            return filename;
        } catch (Exception e) {
            throw new RuntimeException("Unable to save image");
        }
    };
}

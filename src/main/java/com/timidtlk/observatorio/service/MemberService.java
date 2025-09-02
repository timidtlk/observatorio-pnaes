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

import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.timidtlk.observatorio.domain.Member;
import com.timidtlk.observatorio.repo.MemberRepo;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@Transactional(rollbackOn = Exception.class)
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepo memberRepo;

    @EventListener
    public void onApplicationEvent(ContextRefreshedEvent event) {

    }

    public List<Member> getAllMembers() {
        return memberRepo.findAll(Sort.by("name"));
    }

    public Member getMember(UUID id) {
        return memberRepo.findById(id).orElseThrow(() -> new RuntimeException("Member not found"));
    }

    public Member getMember(String name) {
        return memberRepo.findByName(name).orElseThrow(() -> new RuntimeException("Member not found"));
    }

    public Member createMember(Member member) {
        return memberRepo.save(member);
    }

    public void deleteMember(Member member) {
        // TODO: Method not implemented
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
            Path fileStorageLocation = Paths.get(getClass().getClassLoader().getResource(IMAGE_PATH).toURI()).toAbsolutePath().normalize();
            if (!Files.exists(fileStorageLocation)) Files.createDirectories(fileStorageLocation);
            Files.copy(image.getInputStream(), fileStorageLocation.resolve(filename), REPLACE_EXISTING);
            return ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/members/image/" + filename)
                .toUriString();
        } catch (Exception e) {
            throw new RuntimeException("Unable to save image");
        }
    };
}

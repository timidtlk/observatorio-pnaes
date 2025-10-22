package com.timidtlk.observatorio.controller;

import static com.timidtlk.observatorio.utils.Constants.IMAGE_PATH;
import static org.springframework.http.MediaType.IMAGE_JPEG_VALUE;
import static org.springframework.http.MediaType.IMAGE_PNG_VALUE;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient.ResponseSpec;
import org.springframework.web.multipart.MultipartFile;

import com.timidtlk.observatorio.domain.member.Member;
import com.timidtlk.observatorio.infra.security.TokenService;
import com.timidtlk.observatorio.service.MemberService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/members")
public class MemberController {
    @Autowired
    MemberService memberService;

    @Autowired
    TokenService tokenService;

    @PostMapping
    public ResponseEntity<Member> createMember(@RequestBody Member member) {
        return ResponseEntity.created(URI.create("/members/userID")).body(memberService.createMember(member));
    }

    @GetMapping
    public ResponseEntity<List<Member>> getMembers() {
        return ResponseEntity.ok().body(memberService.getAllMembers());
    }

    @GetMapping("/this")
    public ResponseEntity<Member> getMemberByToken(HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if (authHeader == null) return null;
        String token = authHeader.replace("Bearer ", "");

        return ResponseEntity.ok().body(memberService.getMember(tokenService.validateToken(token)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Member> getMember(@PathVariable(value = "id") String id) {
        return ResponseEntity.ok().body(memberService.getMember(UUID.fromString(id)));
    }

    @PutMapping("/photo")
    public ResponseEntity<String> uploadPhoto(@RequestParam("id") String id, @RequestParam("file")MultipartFile file) {
        return ResponseEntity.ok().body(memberService.uploadPhoto(UUID.fromString(id), file));
    }

    @GetMapping(path = "/image/{filename}", produces = { IMAGE_PNG_VALUE, IMAGE_JPEG_VALUE })
    public byte[] getPhoto(@PathVariable("filename") String filename) throws IOException {
        try {
            return Files.readAllBytes(Paths.get(getClass().getClassLoader().getResource(IMAGE_PATH + filename).toURI()));
        } catch (IOException | URISyntaxException e) {
            e.printStackTrace();
            return null;
        }
    }
}

package com.timidtlk.observatorio.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.timidtlk.observatorio.domain.member.Member;
import com.timidtlk.observatorio.domain.post.Post;
import com.timidtlk.observatorio.domain.post.PostRequestDTO;
import com.timidtlk.observatorio.domain.post.PostResponseDTO;
import com.timidtlk.observatorio.infra.security.TokenService;
import com.timidtlk.observatorio.service.MemberService;
import com.timidtlk.observatorio.service.PostService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/posts")
public class PostController {
    @Autowired
    MemberService memberService;
    @Autowired
    PostService postService;
    @Autowired
    TokenService tokenService;
    

    @GetMapping("/count")
    public ResponseEntity<Integer> getCount() {
        return ResponseEntity.ok().body(postService.getAllPosts().size());
    }

    @GetMapping
    public ResponseEntity<Page<Post>> getAllPosts(@RequestParam(value = "page", defaultValue = "0") int page) {
        return ResponseEntity.ok().body(postService.getAllPosts(page));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Post>> search(@PathVariable(name = "q") String searchTerm, @RequestParam(value = "page", defaultValue = "0") int page) {
        return ResponseEntity.ok().body(postService.getAllPosts(page));
    }

    @GetMapping("/{link}")
    public ResponseEntity<PostResponseDTO> getPost(@PathVariable(value = "link") String link) {
        return ResponseEntity.ok().body(postService.getPost(link));
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<List<Post>> getPostsByUser(@PathVariable(value = "id") UUID id) {
        return ResponseEntity.ok().body(postService.getPostsByUser(id));
    }
    
    @PostMapping
    public ResponseEntity<PostResponseDTO> createPost(@RequestBody PostRequestDTO post, HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if (authHeader == null) return null;
        String token = authHeader.replace("Bearer ", "");

        Member member = memberService.getMember(tokenService.validateToken(token));

        Post newPost = post.toEntity();
        newPost.setOriginalPoster(member);

        return ResponseEntity.ok().body(postService.createPost(new PostRequestDTO(newPost)));
    }

    @PutMapping
    public ResponseEntity<PostResponseDTO> updatePost(@RequestBody PostRequestDTO post) {
        return ResponseEntity.ok().body(postService.updatePost(post));
    }

    @DeleteMapping("/{link}")
    public void deletePost(@PathVariable(value = "link") String link) {
        postService.deleteByLink(link);
    }
}

package com.timidtlk.observatorio.controller;

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

import com.timidtlk.observatorio.domain.post.Post;
import com.timidtlk.observatorio.domain.post.PostRequestDTO;
import com.timidtlk.observatorio.domain.post.PostResponseDTO;
import com.timidtlk.observatorio.service.PostService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {
    private PostService postService;

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
    
    @PostMapping
    public ResponseEntity<PostResponseDTO> createPost(@RequestBody PostRequestDTO post) {
        return ResponseEntity.ok().body(postService.createPost(post));
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

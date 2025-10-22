package com.timidtlk.observatorio.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.timidtlk.observatorio.domain.post.Post;
import com.timidtlk.observatorio.domain.post.PostRequestDTO;
import com.timidtlk.observatorio.domain.post.PostResponseDTO;
import com.timidtlk.observatorio.repository.MemberRepository;
import com.timidtlk.observatorio.repository.PostRepository;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@Transactional(rollbackOn = Exception.class)
public class PostService {
    @Autowired
    private PostRepository postRepository;
    @Autowired
    private MemberRepository memberRepository;
    private final int PAGE_SIZE = 10;

    public Page<Post> getAllPosts(int page) {
        return postRepository.findAll(PageRequest.of(page, PAGE_SIZE, Sort.by("createdOn").descending()));
    }

    public Page<Post> getPostsByTerm(String searchTerm, int page) {
        return postRepository.search(searchTerm, PageRequest.of(page, PAGE_SIZE, Sort.by("createdOn").descending()));
    }

    public PostResponseDTO getPost(String link) {
        return postRepository.findByLink(link)
                .orElseThrow(() -> new RuntimeException("Post not found"))
                .toResponseDTO();
    }

    public PostResponseDTO createPost(PostRequestDTO postRequest) {
        String link = postRequest.title().toLowerCase().replaceAll(" ", "-");

        if (postRepository.findByLink(link).isPresent()) {
            int i = 0;
            String newLink = "";
            do {
                newLink = link + "-" + ++i;
            } while (postRepository.findByLink(newLink).isPresent());
            link = newLink;
        }

        Post post = postRequest.toEntity();
        post.setLink(link);

        return postRepository.save(post).toResponseDTO();
    }

    public PostResponseDTO updatePost(PostRequestDTO postRequest) {
        return postRepository.save(getPost(postRequest.link()).toEntity()).toResponseDTO();
    }

    public void deleteByLink(String link) {
        postRepository.delete(postRepository.findByLink(link).orElseThrow(() -> new RuntimeException("Post not found")));
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public List<Post> getPostsByUser(UUID id) {
        return postRepository.findByMember(memberRepository.findById(id).orElseThrow());
    }
}
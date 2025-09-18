package com.timidtlk.observatorio.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.timidtlk.observatorio.domain.post.Post;
import com.timidtlk.observatorio.domain.post.PostRequestDTO;
import com.timidtlk.observatorio.domain.post.PostResponseDTO;
import com.timidtlk.observatorio.repository.PostRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@Transactional(rollbackOn = Exception.class)
@RequiredArgsConstructor
public class PostService {
    private PostRepository postRepository;
    private final int PAGE_SIZE = 10;

    public Page<Post> getAllPosts(int page) {
        return postRepository.findAll(PageRequest.of(page, PAGE_SIZE, Sort.by("created_on").descending()));
    }

    public Page<Post> getPostsByTerm(String searchTerm, int page) {
        return postRepository.search(searchTerm, PageRequest.of(page, PAGE_SIZE, Sort.by("created_on").descending()));
    }

    public PostResponseDTO getPost(String link) {
        return postRepository.findByLink(link)
                .orElseThrow(() -> new RuntimeException("Post not found"))
                .toResponseDTO();
    }

    public PostResponseDTO createPost(PostRequestDTO postRequest) {
        String link = postRequest.title().toLowerCase().replaceAll(" ", "-");

        if (getPost(link) != null) {
            int i = 0;
            String newLink = "";
            do {
                newLink = link + "-" + ++i;
            } while (getPost(newLink) != null);
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
}
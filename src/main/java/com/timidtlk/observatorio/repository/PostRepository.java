package com.timidtlk.observatorio.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.timidtlk.observatorio.domain.post.Post;

public interface PostRepository extends JpaRepository<Post, UUID> {
    Optional<Post> findByLink(String link);
}

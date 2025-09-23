package com.timidtlk.observatorio.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.timidtlk.observatorio.domain.post.Post;

@Repository
public interface PostRepository extends JpaRepository<Post, UUID> {
    Optional<Post> findByLink(String link);

    @Query("FROM Post p WHERE LOWER(p.title) LIKE %:searchTerm%")
    Page<Post> search(@Param("searchTerm") String searchTerm, Pageable pageable);
}

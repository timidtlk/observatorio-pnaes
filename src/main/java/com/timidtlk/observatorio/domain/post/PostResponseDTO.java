package com.timidtlk.observatorio.domain.post;

import java.time.Instant;
import java.util.UUID;

import com.timidtlk.observatorio.domain.member.Member;
import com.timidtlk.observatorio.enums.PostType;

public record PostResponseDTO(UUID id, String title, PostType type, String description, 
    String content, Instant createdOn, Instant lastUpdatedOn, String link, Member originalPoster) {

    public PostResponseDTO(Post post) {
        this(post.getId(), post.getTitle(), post.getType(), post.getDescription(), 
        post.getContent(), post.getCreatedOn(), post.getLastUpdatedOn(), post.getLink(), post.getOriginalPoster());
    }

    public Post toEntity() {
        return new Post(id, title, type, createdOn, lastUpdatedOn, description, content, link, originalPoster);
    }
}

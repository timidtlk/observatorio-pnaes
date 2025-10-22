package com.timidtlk.observatorio.domain.post;

import com.timidtlk.observatorio.domain.member.Member;
import com.timidtlk.observatorio.enums.PostType;

public record PostRequestDTO(String title, PostType type, String description, String content, String link, Member originalPoster) {
    public PostRequestDTO(Post post) {
        this(post.getTitle(), post.getType(), post.getDescription(), post.getContent(), post.getLink(), post.getOriginalPoster());
    }

    public Post toEntity() {
        return new Post(title, type, description, content, link, originalPoster);
    }
}

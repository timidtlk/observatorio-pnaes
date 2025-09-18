package com.timidtlk.observatorio.domain.post;

import java.time.Instant;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import com.timidtlk.observatorio.domain.member.Member;
import com.timidtlk.observatorio.enums.PostType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "posts")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Post {
    @Id
    @UuidGenerator
    private UUID id;
    private String title;
    @Enumerated(EnumType.STRING)
    private PostType type;
    @CreationTimestamp
    private Instant createdOn;
    @UpdateTimestamp
    private Instant lastUpdatedOn;
    @Column(length = 1000000)
    private String description;
    @Column(length = 1000000)
    private String content;
    private String link;
    @ManyToOne
    private Member originalPoster;

    public Post(String title, PostType type, String description, String content, String link, Member originalPoster) {
        this.title = title;
        this.type = type;
        this.description = description;
        this.content = content;
        this.link = link;
        this.originalPoster = originalPoster;
    }

    public PostResponseDTO toResponseDTO() {
        return new PostResponseDTO(this);
    }

    public void setPost(PostRequestDTO post) {
        this.title = post.title();
        this.type = post.type();
        this.description = post.description();
        this.content = post.content();
        this.originalPoster = post.originalPoster();
    }
}
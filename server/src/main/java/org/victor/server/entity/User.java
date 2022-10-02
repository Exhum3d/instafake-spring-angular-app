package org.victor.server.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Data
@Table(name = "users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 64, nullable = false)
    private String firstName;

    @Column(length = 64, nullable = false)
    private String lastName;

    @Column(length = 64, nullable = false)
    private String email;

    @Column(length = 256, nullable = false)
    @JsonIgnore
    private String password;

    @Column(length = 256)
    private String profileImage;

    @Column(length = 32, nullable = false)
    private String Role;

    private Integer followerCount;
    private Integer followingCount;
    private Boolean enabled;


    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy HH:mm:ss")
    private Date createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy HH:mm:ss")
    private Date updatedAt;

    @ManyToMany
    @JoinTable(
            name = "users_follow",
            joinColumns = @JoinColumn(name = "followed_id"),
            inverseJoinColumns = @JoinColumn(name = "follower_id")
    )
    @JsonIgnore
    private List<User> followerUsers = new ArrayList<>();

    @ManyToMany(mappedBy = "followerUsers")
    @JsonIgnore
    private List<User> followedUsers = new ArrayList<>();

    @OneToMany(mappedBy = "author", cascade = CascadeType.REMOVE)
    @JsonIgnore
    private List<Post> posts = new ArrayList<>();

    @ManyToMany(mappedBy = "likeList", cascade = CascadeType.REMOVE)
    @JsonIgnore
    private List<Post> likedPosts = new ArrayList<>();

    @ManyToMany(mappedBy = "likeList", cascade = CascadeType.REMOVE)
    @JsonIgnore
    private List<Comment> likedComments = new ArrayList<>();
}

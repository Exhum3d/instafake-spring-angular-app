package org.victor.server.response;

import lombok.*;
import org.victor.server.entity.Post;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostResponse {
    private Post post;
    private Boolean likedByAuthUser;
}

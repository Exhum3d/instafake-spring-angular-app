package org.victor.server.dto;

import lombok.*;

import javax.validation.constraints.Email;
import javax.validation.constraints.Size;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignUpDto {

    @Email
    private String email;

    private String password;

    @Size(max = 64)
    private String firstName;

    @Size(max = 64)
    private String lastName;
}

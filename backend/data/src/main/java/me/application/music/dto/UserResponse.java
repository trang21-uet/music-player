package me.application.music.dto;

import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.web.multipart.MultipartFile;

@Data
@Accessors(chain = true)
public class UserResponse {
    private Long   id;
    private String firstName;
    private String lastName;
    private String username;
    private String avatar;
    private Long   roleId;

}
package me.application.music.dto;

import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.web.multipart.MultipartFile;

@Data
@Accessors(chain = true)
public class SongRequest {
    private MultipartFile file;
    private String ownerId;
    private String region;
    private String title;
    private String artist;
    private String album;
}

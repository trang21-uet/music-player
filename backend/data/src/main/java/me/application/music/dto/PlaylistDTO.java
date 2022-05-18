package me.application.music.dto;

import lombok.Data;
import lombok.experimental.Accessors;
import me.application.music.music_application.tables.pojos.Song;

import java.util.List;

@Data
@Accessors(chain = true)
public class PlaylistDTO {
    private Long   id;
    private Long   ownerId;
    private String name;
    private List<Song> songs;
}

package me.application.music.service;

import me.application.music.dto.PlaylistDTO;
import me.application.music.music_application.tables.pojos.Playlist;
import me.application.music.music_application.tables.pojos.Song;
import me.application.music.repository.impl.PlaylistRepositoryImpl;
import me.application.music.repository.impl.SongRepositoryImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlaylistService {
    @Autowired private PlaylistRepositoryImpl playlistRepository;
    @Autowired private SongRepositoryImpl songRepository;

    private PlaylistDTO toPlaylistDTO(Playlist playlist) {
        PlaylistDTO playlistDTO = new PlaylistDTO();
        playlistDTO.setId(playlist.getId());
        playlistDTO.setName(playlist.getName());
        playlistDTO.setOwnerId(playlist.getOwnerId());

        playlistDTO.setSongs(this.convertIdsToSongs(playlist.getSongs()));
        return playlistDTO;
    }

    public Integer update(Playlist playlist) {
        playlistRepository.update(playlist);
        return 1;
    }

    public Integer insert(Playlist playlist) {
        playlistRepository.createOne(playlist);
        return 1;
    }

    public List<PlaylistDTO> getPlaylistsByName(String name) {
        return playlistRepository.findByName(name).stream().map(this::toPlaylistDTO)
                .collect(Collectors.toList());
    }

    public List<PlaylistDTO> getPlaylistsByUser(String ownerId) {
        return playlistRepository.findByOwnerId(ownerId).stream().map(this::toPlaylistDTO)
                .collect(Collectors.toList());
    }

    public PlaylistDTO getPlaylistById(String id) {
        return this.toPlaylistDTO(playlistRepository.findById(id));
    }

    private List<Song> convertIdsToSongs(String ids) {
        String[] split = ids.split(",");
        return songRepository.findByIds(List.of(split));
    }

    private String convertSongsToIds(List<Song> songs) {
        final String[] ids = {""};
        songs.forEach(song -> {
            ids[0] = ids[0] + "," + song.getId();
        });
        return ids[0];
    }
}

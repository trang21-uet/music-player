package me.application.music.service;

import me.application.music.dto.PlaylistDTO;
import me.application.music.music_application.tables.pojos.Playlist;
import me.application.music.music_application.tables.pojos.PlaylistSongs;
import me.application.music.music_application.tables.pojos.Song;
import me.application.music.repository.impl.PlaylistRepositoryImpl;
import me.application.music.repository.impl.PlaylistSongRepositoryImpl;
import me.application.music.repository.impl.SongRepositoryImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlaylistService {
    @Autowired private PlaylistRepositoryImpl playlistRepository;
    @Autowired private SongRepositoryImpl songRepository;
    @Autowired private PlaylistSongRepositoryImpl playlistSongRepository;

    private PlaylistDTO toPlaylistDTO(Playlist playlist, List<Song> songs) {
        PlaylistDTO playlistDTO = new PlaylistDTO();
        playlistDTO.setId(playlist.getId());
        playlistDTO.setName(playlist.getName());
        playlistDTO.setOwnerId(playlist.getOwnerId());
        playlistDTO.setSongs(songs);
        return playlistDTO;
    }

    public Integer update(Playlist playlist) {
        playlistRepository.update(playlist);
        return 1;
    }

    public Integer create(Playlist playlist) {
        playlistRepository.createOne(playlist);
        return 1;
    }

    public Integer delete(String id) {
        playlistRepository.delete(id);
        playlistSongRepository.deleteSongByPlaylistId(id);
        return 1;
    }

    public Integer insertNewSong(PlaylistSongs playlistSongs) {
        playlistSongRepository.createOne(playlistSongs);
        return 1;
    }

    public Integer deleteSongInPlaylist(String id) {
        playlistSongRepository.delete(id);
        return 1;
    }

    public List<PlaylistDTO> getPlaylistsByName(String name) {
        List<Playlist> playlists = playlistRepository.findAllByName(name);
        return mapToPlaylistDTOs(playlists);
    }

    public PlaylistDTO getPlaylistById(String playlistId) {
        Playlist playlist = playlistRepository.findById(playlistId);
        return mapToPlaylistDTO(playlist);
    }

    public List<PlaylistDTO> getPlaylistsByOwnerId(String ownerId) {
        List<Playlist> playlists = playlistRepository.findByOwnerId(ownerId);
        return mapToPlaylistDTOs(playlists);
    }

    private List<PlaylistDTO> mapToPlaylistDTOs(List<Playlist> playlists) {
        return playlists.stream().map(this::mapToPlaylistDTO).collect(Collectors.toList());
    }

    private PlaylistDTO mapToPlaylistDTO(Playlist playlist) {
        List<String> songsId = playlistSongRepository.findAllSongsByPlaylistId(String.valueOf(playlist.getId()))
                .stream().map(PlaylistSongs::getSongId).collect(Collectors.toList());
        return this.toPlaylistDTO(playlist, songRepository.findByIds(songsId));
    }
}

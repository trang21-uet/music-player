package me.application.music.service;

import me.application.music.music_application.tables.pojos.Song;
import me.application.music.repository.impl.SongRepositoryImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class SongService {
    @Autowired
    private SongRepositoryImpl songRepository;

    public List<Song> findAll() {
        return songRepository.findAll();
    }

    public Song findById(String id) {
        return songRepository.findById(id);
    }

    public Integer create(Song song) {
        return songRepository.createOne(song);
    }

    public Integer update(Song song) {
        return songRepository.update(song);
    }

    public Integer delete(String id) {
        return songRepository.delete(id);
    }

    public Integer setChecked(String songId, boolean bool) {
        return songRepository.setChecked(songId, bool);
    }

    public List<Song> getSongsByName(String name, int offset, int limit) {
        return songRepository.getSongsByName(name, offset, limit);
    }

    public List<Song> getSongsByArtist(String artist, int offset, int limit) {
        return songRepository.getSongsByArtist(artist, offset, limit);
    }

    public List<Song> getSongsByAlbum(String album, int offset, int limit) {
        return songRepository.getSongsByAlbum(album, offset, limit);
    }

    public List<Song> getTopSongsByParam(String param, int offset, int limit) {
        return songRepository.getTopSongsByParam(param, offset, limit);
    }

    public Map<String, List<Song>> getTopSongsByRegions(List<String> regions) {
        return songRepository.getTopSongsByRegions(regions);
    }

    public List<Song> getUnCheckedSongs() {
        return songRepository.getUnCheckedSongs();
    }
}

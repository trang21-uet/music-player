package me.application.music.controller;

import me.application.music.dto.PlaylistDTO;
import me.application.music.music_application.tables.pojos.Playlist;
import me.application.music.music_application.tables.pojos.PlaylistSongs;
import me.application.music.service.PlaylistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class PlaylistController {

    @Autowired private PlaylistService playlistService;

    @PostMapping("/playlist")
    public ResponseEntity<String> createNewPlaylist(@RequestBody Playlist playlist) {
        playlistService.create(playlist);
        return ResponseEntity.ok("Success");
    }

    @DeleteMapping("/playlist/{id}")
    public ResponseEntity<String> deletePlaylist(@PathVariable String id) {
        playlistService.delete(id);
        return ResponseEntity.ok("Success");
    }

    @PutMapping("/playlist")
    public ResponseEntity<String> updatePlaylist(@RequestBody Playlist playlist) {
        playlistService.update(playlist);
        return ResponseEntity.ok("Success");
    }

    @PostMapping("/playlist/songs")
    public ResponseEntity<String> insertNewSong(@RequestBody PlaylistSongs playlistSongs) {
        playlistService.insertNewSong(playlistSongs);
        return ResponseEntity.ok("Success");
    }

    @DeleteMapping("/playlist/songs/{id}")
    public ResponseEntity<String> deleteSongInPlaylist(@RequestParam String playlistId,
                                                       @RequestParam String songId) {
        playlistService.deleteSongInPlaylist(playlistId, songId);
        return ResponseEntity.ok("Success");
    }

    @GetMapping("/playlist")
    public ResponseEntity<Object> getPlaylistById(@RequestParam(required = false) String playlistId,
                                                  @RequestParam(required = false) String name,
                                                  @RequestParam(required = false) String ownerId) {
        if (playlistId != null){
            return ResponseEntity.ok(playlistService.getPlaylistById(playlistId));
        } else if (name != null) {
            return ResponseEntity.ok(playlistService.getPlaylistsByName(name));
        } else if(ownerId != null) {
            return ResponseEntity.ok(playlistService.getPlaylistsByOwnerId(ownerId));
        }
        return ResponseEntity.badRequest().body("Wrong Param");
    }
}

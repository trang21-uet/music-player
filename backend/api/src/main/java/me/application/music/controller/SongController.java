package me.application.music.controller;

import me.application.music.music_application.tables.pojos.Song;
import me.application.music.service.SongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import me.application.music.local.service.LocalFileStorageServiceImpl;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;

import java.util.List;
import java.util.Map;

@RestController
public class SongController {

    @Autowired private LocalFileStorageServiceImpl localFileStorageService;
    @Autowired private SongService songService;

    @GetMapping("songs")
    public ResponseEntity<List<Song>> getAllFileNames() {
        return ResponseEntity.ok(localFileStorageService.getFileInfos());
    }

    @GetMapping("songs/{fileName}")
    public ResponseEntity<Resource> getFile(@PathVariable String fileName) {
        Resource file = localFileStorageService.loadSong(fileName);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + file.getFilename() + "\"").body(file);
    }

    @GetMapping("images/{imageName}")
    public ResponseEntity<Resource> getImage(@PathVariable String imageName) {
        Resource file = localFileStorageService.loadImage(imageName);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + file.getFilename() + "\"").body(file);
    }

    @PostMapping("upload")
    public ResponseEntity<String> uploadSong(@RequestParam MultipartFile file,
                                             @RequestParam String ownerId,
                                             @RequestParam(defaultValue = "null") String region) {
        localFileStorageService.save(file, ownerId, region);
        return ResponseEntity.ok("Upload Success");
    }

    @PostMapping("songs/incNumListened")
    public ResponseEntity<String> incNumListened(@RequestParam String id) {
        localFileStorageService.incNumListened(id);
        return ResponseEntity.ok("Increased Success");
    }

    @PutMapping("songs/check")
    public ResponseEntity<Integer> setChecked(@RequestParam String songId, @RequestParam boolean bool) {
        return ResponseEntity.ok(songService.setChecked(songId, bool));
    }

    @GetMapping("songs/getSongsByName")
    public ResponseEntity<List<Song>> getSongsByName(@RequestParam String name,
                                                     @RequestParam Integer offset,
                                                     @RequestParam Integer limit) {
        return ResponseEntity.ok(songService.getSongsByName(name, offset, limit));
    }

    @GetMapping("songs/getSongsByArtist")
    public ResponseEntity<List<Song>> getSongsByArtist(@RequestParam String artist,
                                                     @RequestParam Integer offset,
                                                     @RequestParam Integer limit) {
        return ResponseEntity.ok(songService.getSongsByArtist(artist, offset, limit));
    }

    @GetMapping("songs/getSongsByAlbum")
    public ResponseEntity<List<Song>> getSongsByAlbum(@RequestParam String album,
                                                     @RequestParam Integer offset,
                                                     @RequestParam Integer limit) {
        return ResponseEntity.ok(songService.getSongsByAlbum(album, offset, limit));
    }

    @GetMapping("songs/getTopSongsByParam")
    public ResponseEntity<List<Song>> getTopSongsByParam(@RequestParam String param,
                                                     @RequestParam Integer offset,
                                                     @RequestParam Integer limit) {
        return ResponseEntity.ok(songService.getTopSongsByParam(param, offset, limit));
    }

    @GetMapping("songs/getTopSongsByRegions")
    public ResponseEntity<Map<String, List<Song>>> getTopSongsByRegions(@RequestParam List<String> regions) {
        return ResponseEntity.ok(songService.getTopSongsByRegions(regions));
    }

    @GetMapping("/songs/uncheckedSongs")
    public ResponseEntity<List<Song>> getUnCheckedSongs() {
        return ResponseEntity.ok(songService.getUnCheckedSongs());
    }

    @GetMapping("/songs/getMapTopSongsByParam")
    public ResponseEntity<Map<String, List<Song>>> getMapTopSongsByParam(@RequestParam String param,
                                                                         @RequestParam Integer offset,
                                                                         @RequestParam Integer limit) {
        return ResponseEntity.ok(songService.getMapTopSongsByParam(param, offset, limit));
    }
}

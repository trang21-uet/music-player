package me.application.music.controller;

import me.application.music.music_application.tables.pojos.Song;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import me.application.music.local.service.LocalFileStorageServiceImpl;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;

import java.util.List;

@RestController
public class SongController {

    @Autowired private LocalFileStorageServiceImpl localFileStorageService;

    @GetMapping("songs")
    public ResponseEntity<List<Song>> getAllFileNames() {
        return ResponseEntity.ok(localFileStorageService.getFileInfos(MvcUriComponentsBuilder
                .fromMethodName(this.getClass(), "getAllFileNames")));
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
    public ResponseEntity<String> uploadSong(@RequestParam MultipartFile file, @RequestParam String ownerId) {
        localFileStorageService.save(file, ownerId);
        return ResponseEntity.ok("Upload Success");
    }
}

package me.application.music.controller;

import me.application.music.local.model.FileInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import me.application.music.local.service.LocalFileStorageServiceImpl;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;
import org.springframework.web.util.UriBuilder;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class SongController {

    @Autowired private LocalFileStorageServiceImpl localFileStorageService;

    @GetMapping("songs")
    public ResponseEntity<List<FileInfo>> getAllFileNames() {
        return ResponseEntity.ok(localFileStorageService.getFileInfos(MvcUriComponentsBuilder
                .fromMethodName(this.getClass(), "getAllFileNames")));
    }

    @GetMapping("songs/{url}")
    public ResponseEntity<Resource> getFile(@PathVariable String url) {
        Resource file = localFileStorageService.load(url);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + file.getFilename() + "\"").body(file);
    }

    @PostMapping("upload")
    public ResponseEntity<String> uploadSong(MultipartFile file) {
        localFileStorageService.save(file);
        return ResponseEntity.ok("Upload Success");
    }
}

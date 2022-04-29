package me.application.music.local.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.stream.Stream;

public interface ILocalFileStorageService {
    void init();
    void save(MultipartFile file, String ownerId, String region);
    Resource loadSong(String fileName);

    Resource loadImage(String imageName);
    void deleteAll();
    Stream<Path> loadAll();
}

package me.application.music.local.service;

import lombok.SneakyThrows;
import me.application.music.local.model.FileInfo;
import me.application.music.music_application.tables.pojos.Song;
import me.application.music.repository.impl.SongRepositoryImpl;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.parser.Parser;
import org.apache.tika.parser.mp3.Mp3Parser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;
import org.xml.sax.ContentHandler;
import org.xml.sax.helpers.DefaultHandler;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class LocalFileStorageServiceImpl implements ILocalFileStorageService {

    private final Path root = Paths.get("songs");

    @Autowired private SongRepositoryImpl songRepository;

    @Override
    public void init() {
        try {
            Files.createDirectory(root);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize folder for upload!");
        }
    }

    @Override
    public void save(MultipartFile file, String ownerId) {
        try {
            Path path = this.root.resolve(Objects.requireNonNull(file.getOriginalFilename()));
            Files.copy(file.getInputStream(), path);
            Map<String, String> metadata = this.getFileMetadata(path);
            Song song = new Song();
            song.setFileName(path.getFileName().toString());
            song.setArtist(metadata.get("xmpDM:artist"));
            song.setUrl(path.getFileName().toString());
            song.setOwnerId(Long.valueOf(ownerId));
            song.setTitle(metadata.get("dc:title"));
            song.setDuration(Double.valueOf(metadata.get("xmpDM:duration")));
            song.setNumListened(0L);
            songRepository.createOne(song);

        } catch (Exception e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }
    }

    @Override
    public Resource load(String filename) {
        try {
            Path file = root.resolve(filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Could not read the file!");
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }

    @Override
    public void deleteAll() {
        FileSystemUtils.deleteRecursively(root.toFile());
    }

    @Override
    public Stream<Path> loadAll() {
        try {
            return Files.walk(this.root, 1).filter(path -> !path.equals(this.root)).map(this.root::relativize);
        } catch (IOException e) {
            throw new RuntimeException("Could not load the files!");
        }
    }

    @SneakyThrows
    public List<Song> getFileInfos(UriComponentsBuilder methodUrl) {

        List<Song> songs = songRepository.findAll();
        songs.forEach(song -> {
            song.setUrl(methodUrl.pathSegment(song.getFileName()).build().encode().toString());
        });

        return songs;
    }

    public Map<String, String> getFileMetadata(Path path) {
        try {
            InputStream input = new FileInputStream(path.toFile());
            ContentHandler handler = new DefaultHandler();
            Metadata metadata = new Metadata();
            Parser parser = new Mp3Parser();
            ParseContext parseCtx = new ParseContext();
            parser.parse(input, handler, metadata, parseCtx);
            input.close();

            return Stream.of(metadata.names())
                    .collect(Collectors.toMap(name -> name, metadata::get));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}

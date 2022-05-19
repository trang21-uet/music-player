package me.application.music.local.service;

import lombok.SneakyThrows;
import me.application.music.music_application.tables.pojos.Song;
import me.application.music.repository.impl.SongRepositoryImpl;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.parser.Parser;
import org.apache.tika.parser.mp3.Mp3Parser;
import org.jaudiotagger.audio.exceptions.InvalidAudioFrameException;
import org.jaudiotagger.audio.exceptions.ReadOnlyFileException;
import org.jaudiotagger.audio.mp3.MP3File;
import org.jaudiotagger.tag.TagException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;
import org.xml.sax.ContentHandler;
import org.xml.sax.helpers.DefaultHandler;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
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

    private final Path root = Paths.get("resources");

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
    public void save(MultipartFile file, String ownerId, String region) {
        try {
            Path path = this.root.resolve("songs/" + Objects.requireNonNull(file.getOriginalFilename()));
            Files.copy(file.getInputStream(), path);
            Song song = createMetadataSong(ownerId, region, path);

            songRepository.createOne(song);

        } catch (Exception e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }
    }

    private Song createMetadataSong(String ownerId, String region, Path path) throws IOException, TagException, ReadOnlyFileException, InvalidAudioFrameException {
        Map<String, String> metadata = this.getFileMetadata(path);
        Song song = new Song();
        song.setFileName(path.getFileName().toString());
        song.setArtist(metadata.getOrDefault("xmpDM:artist", null));
        song.setUrl(path.getFileName().toString());
        song.setOwnerId(Long.valueOf(ownerId));
        song.setTitle(metadata.getOrDefault("dc:title", null));
        song.setDuration(Double.valueOf(metadata.getOrDefault("xmpDM:duration", "0")));
        song.setNumListened(0L);
        song.setGenre(metadata.getOrDefault("xmpDM:genre", null));//chu y thay doi
        song.setRegion(region);
        song.setAlbum(metadata.getOrDefault("xmpDM:album", null));
        song.setNumTrack(Long.valueOf(metadata.getOrDefault("xmpDM:trackNumber", "1")));
        song.setIsChecked(false);

        createImage(path, song);
        return song;
    }

    private void createImage(Path path, Song song) throws IOException, TagException, ReadOnlyFileException, InvalidAudioFrameException {
        try {
            MP3File mp3 = new MP3File(path.toFile());
            BufferedImage icon = mp3.getTag().getFirstArtwork().getImage();
            String imageUrl = root + "/covers/" + path.toFile().getName().replaceFirst("[.][^.]+$", "") + ".png";
            ImageIO.write(icon, "png", new File(imageUrl));
            song.setCoverImage(path.toFile().getName().replaceFirst("[.][^.]+$", "") + ".png");
        } catch (Exception e) {
            song.setCoverImage("default.png");
        }
    }

    @Override
    public Resource loadSong(String filename) {
        try {
            Song song = songRepository.getSongsByName(filename, 0, 1).get(0);
            if(song.getIsChecked()) {
                Path file = root.resolve("songs/" + filename);
                Resource resource = new UrlResource(file.toUri());
                if (resource.exists() || resource.isReadable()) {
                    return resource;
                } else {
                    throw new RuntimeException("Could not read the file!");
                }
            }
            return null;
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }

    @Override
    public Resource loadImage(String imageName) {
        try {
            Path file = root.resolve("covers/" + imageName);
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
        FileSystemUtils.deleteRecursively(Paths.get(this.root + "/songs").toFile());
    }

    @Override
    public Stream<Path> loadAll() {
        try {
            return Files.walk(Paths.get(this.root.toString() + "/songs"), 1).filter(path -> !path.equals(this.root)).map(this.root::relativize);
        } catch (IOException e) {
            throw new RuntimeException("Could not load the files!");
        }
    }

    @SneakyThrows
    public List<Song> getFileInfos(UriComponentsBuilder methodUrl) {

        List<Song> songs = songRepository.findAll();
        songs.forEach(song -> {
            song.setUrl(UriComponentsBuilder.fromUri(methodUrl.build().toUri()).pathSegment(song.getUrl()).build().encode().toString());
            song.setCoverImage(UriComponentsBuilder.fromUriString(
                    methodUrl.build().getScheme()
                            + "://"
                            + methodUrl.build().getHost()
                            + ":"
                            + methodUrl.build().getPort()
                            + "/images")
                        .pathSegment(song.getCoverImage()).build().encode().toString());
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

    public Integer incNumListened(String id) {
        return songRepository.incNumListened(id);
    }

}

package me.application.music.local.service;

import lombok.SneakyThrows;
import me.application.music.local.model.FileInfo;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.parser.Parser;
import org.apache.tika.parser.mp3.Mp3Parser;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;
import org.springframework.web.util.UriComponentsBuilder;
import org.xml.sax.ContentHandler;
import org.xml.sax.helpers.DefaultHandler;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class LocalFileStorageServiceImpl implements ILocalFileStorageService {

    private final Path root = Paths.get("songs");

    @Override
    public void init() {
        try {
            Files.createDirectory(root);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize folder for upload!");
        }
    }

    @Override
    public void save(MultipartFile file) {
        try {
            Files.copy(file.getInputStream(), this.root.resolve(Objects.requireNonNull(file.getOriginalFilename())));
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
    public List<FileInfo> getFileInfos(UriComponentsBuilder methodUrl) {
        return Files.walk(this.root, 1).filter(path -> !path.equals(this.root)).map(path -> {
            String fileName = path.getFileName().toString();
            String url = methodUrl.uri(path.toUri()).build().toString();


            try {
                InputStream input = new FileInputStream(path.toFile());
                ContentHandler handler = new DefaultHandler();
                Metadata metadata = new Metadata();
                Parser parser = new Mp3Parser();
                ParseContext parseCtx = new ParseContext();
                parser.parse(input, handler, metadata, parseCtx);
                input.close();

                List<String> metadataNames = List.of(metadata.names());
                metadataNames.forEach(name -> {
                    System.out.println(name + " : " + metadata.get(name));
                });
            } catch (Exception e) {
                throw new RuntimeException(e);
            }


            FileInfo info = new FileInfo();
            info.setFileName(fileName);
            info.setUrl(url);
            return info;
        }).collect(Collectors.toList());
    }
//
//    @SneakyThrows
//    public List<String> getFileNames() {
//        return List.of(Objects.requireNonNull(this.root.toFile().list()));
//    }
}

package me.application.music.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Bucket;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.StorageClient;
import lombok.SneakyThrows;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.nio.file.Files;
import java.nio.file.Paths;

@Service
public class UserService {
    @SneakyThrows
//    @Bean
    public void findAll() {

        String bucketName = "music-application-7bed9.appspot.com";

        String fileName = "../Ngay Dau Tien - Duc Phuc.mp3";

        FileInputStream serviceAccount =
                new FileInputStream("music-application-7bed9-firebase-adminsdk-i8i14-1fdd340eb4.json");

        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .setStorageBucket(bucketName)
                .build();
        FirebaseApp.initializeApp(options);

        Bucket bucket = StorageClient.getInstance().bucket();

        BlobId blobId = BlobId.of(bucketName, fileName);

        BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                .setContentType("audio/mpeg")
                .build();
        bucket.create(String.valueOf(blobInfo), Files.readAllBytes(Paths.get(fileName)));
    }
}

package me.application.music.service;

import lombok.SneakyThrows;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;

@Service
public class UserService {
    @SneakyThrows
//    @Bean
    public void findAll() {

        String bucketName = "music-application-7bed9.appspot.com";

        String fileName = "../Ngay Dau Tien - Duc Phuc.mp3";

        FileInputStream serviceAccount =
                new FileInputStream("music-application-7bed9-firebase-adminsdk-i8i14-1fdd340eb4.json");

//        FirebaseOptions options = FirebaseOptions.builder()
//                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
//                .setStorageBucket(bucketName)
//                .build();
//        FirebaseApp.initializeApp(options);
//
//        Bucket bucket = StorageClient.getInstance().bucket();
//
//        BlobId blobId = BlobId.of(bucketName, fileName);
//
//        BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
//                .setContentType("audio/mpeg")
//                .build();
//        bucket.create(String.valueOf(blobInfo), Files.readAllBytes(Paths.get(fileName)));
    }
}

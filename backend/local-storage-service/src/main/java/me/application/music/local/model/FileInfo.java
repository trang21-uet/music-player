package me.application.music.local.model;

import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class FileInfo {
    private String fileName;
    private String url;
}

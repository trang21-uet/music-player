package me.application.music.repository.impl;

import me.application.music.music_application.tables.pojos.Song;
import me.application.music.music_application.tables.records.SongRecord;
import me.application.music.repository.AbsMysqlRepository;
import org.jooq.impl.TableImpl;
import org.springframework.stereotype.Repository;

import static me.application.music.music_application.tables.Song.SONG;

@Repository
public class SongRepositoryImpl extends AbsMysqlRepository<Song, SongRecord> {
    @Override
    public TableImpl<SongRecord> getTable() {
        return SONG;
    }
}
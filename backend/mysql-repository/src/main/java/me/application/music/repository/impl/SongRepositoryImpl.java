package me.application.music.repository.impl;

import me.application.music.music_application.tables.pojos.Song;
import me.application.music.music_application.tables.records.SongRecord;
import me.application.music.repository.AbsMysqlRepository;
import org.jooq.impl.TableImpl;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static me.application.music.music_application.tables.Song.SONG;

@Repository
public class SongRepositoryImpl extends AbsMysqlRepository<Song, SongRecord> {
    @Override
    public TableImpl<SongRecord> getTable() {
        return SONG;
    }

    @Override
    public List<Song> findAll() {
        return dslContext.select()
                .from(this.getTable())
                .where(SONG.IS_CHECKED.eq(true))
                .fetchInto(pClass);
    }

    public Integer incNumListened(String id) {
        return dslContext.update(this.getTable())
                .set(SONG.NUM_LISTENED, SONG.NUM_LISTENED.add(1))
                .where(SONG.ID.eq(Long.valueOf(id)))
                .execute();
    }

    public Integer setChecked(String id, boolean bool) {
        return dslContext.update(this.getTable())
                .set(SONG.IS_CHECKED, bool)
                .where(SONG.ID.eq(Long.valueOf(id)))
                .execute();
    }

    public List<Song> getSongsByName(String name, int offset, int limit) {
        return dslContext.select()
                .from(this.getTable())
                .where(SONG.FILE_NAME.contains(name))
                .and(SONG.IS_CHECKED.eq(true))
                .orderBy(SONG.NUM_LISTENED.desc())
                .offset(offset)
                .limit(limit)
                .fetchInto(this.pClass);
    }

    public List<Song> getSongsByArtist(String artist, int offset, int limit) {
        return dslContext.select()
                .from(this.getTable())
                .where(SONG.ARTIST.contains(artist))
                .and(SONG.IS_CHECKED.eq(true))
                .orderBy(SONG.NUM_LISTENED.desc())
                .offset(offset)
                .limit(limit)
                .fetchInto(this.pClass);
    }

    public List<Song> getSongsByAlbum(String album, int offset, int limit) {
        return dslContext.select()
                .from(this.getTable())
                .where(SONG.ALBUM.contains(album))
                .and(SONG.IS_CHECKED.eq(true))
                .orderBy(SONG.NUM_LISTENED.desc())
                .offset(offset)
                .limit(limit)
                .fetchInto(this.pClass);
    }

    public List<Song> getTopSongsByParam(String param, int offset, int limit) {
        return dslContext.select()
                .from(this.getTable())
                .where(SONG.ALBUM.contains(param).or(SONG.FILE_NAME.contains(param).or(SONG.ARTIST.contains(param))))
                .and(SONG.IS_CHECKED.eq(true))
                .orderBy(SONG.NUM_LISTENED.desc())
                .offset(offset)
                .limit(limit)
                .fetchInto(this.pClass);
    }

    public Map<String, List<Song>> getTopSongsByRegions(List<String> regions) {
        Map<String, List<Song>> songMap = new HashMap<>();
        regions.forEach(region -> {
            List<Song> songs = dslContext.select()
                    .from(this.getTable())
                    .where(SONG.REGION.in(region))
                    .and(SONG.IS_CHECKED.eq(true))
                    .groupBy(SONG.REGION)
                    .orderBy(SONG.NUM_LISTENED.desc())
                    .limit(10)
                    .fetchInto(this.pClass);
            songMap.put(region, songs);
        });
        return songMap;
    }

    public List<Song> getUnCheckedSongs() {
        return dslContext.select()
                .from(this.getTable())
                .where(SONG.IS_CHECKED.eq(false))
                .fetchInto(this.pClass);
    }
}

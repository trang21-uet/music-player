package me.application.music.repository.impl;

import me.application.music.music_application.tables.pojos.PlaylistSongs;
import me.application.music.music_application.tables.records.PlaylistSongsRecord;
import me.application.music.repository.AbsMysqlRepository;
import org.jooq.impl.TableImpl;
import org.springframework.stereotype.Repository;

import java.util.List;

import static me.application.music.music_application.Tables.PLAYLIST_SONGS;

@Repository
public class PlaylistSongRepositoryImpl extends AbsMysqlRepository<PlaylistSongs, PlaylistSongsRecord> {
    @Override
    public TableImpl<PlaylistSongsRecord> getTable() {
        return PLAYLIST_SONGS;
    }

    public Integer deleteSongByPlaylistId(String playlistId) {
        return dslContext.delete(PLAYLIST_SONGS)
                .where(PLAYLIST_SONGS.PLAYLIST_ID.eq(Long.valueOf(playlistId)))
                .execute();
    }

    public List<PlaylistSongs> findAllSongsByPlaylistId(String playlistId) {
        return dslContext.select()
                .from(PLAYLIST_SONGS)
                .where(PLAYLIST_SONGS.PLAYLIST_ID.eq(Long.valueOf(playlistId)))
                .fetchInto(PlaylistSongs.class);
    }
}

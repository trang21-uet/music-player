package me.application.music.repository.impl;

import me.application.music.music_application.tables.pojos.Playlist;
import me.application.music.music_application.tables.records.PlaylistRecord;
import me.application.music.repository.AbsMysqlRepository;
import org.jooq.impl.TableImpl;
import org.springframework.stereotype.Repository;

import java.util.List;

import static me.application.music.music_application.Tables.PLAYLIST;

@Repository
public class PlaylistRepositoryImpl extends AbsMysqlRepository<Playlist, PlaylistRecord> {
    @Override
    public TableImpl<PlaylistRecord> getTable() {
        return PLAYLIST;
    }

    public List<Playlist> findAllByName(String name) {
        return this.dslContext.select()
                .from(PLAYLIST)
                .where(PLAYLIST.NAME.contains(name))
                .fetchInto(this.pClass);
    }

    public List<Playlist> findByOwnerId(String ownerId) {
        return this.dslContext.select()
                .from(PLAYLIST)
                .where(PLAYLIST.OWNER_ID.eq(Long.valueOf(ownerId)))
                .fetchInto(this.pClass);
    }
}

package me.application.music.repository.impl;

import me.application.music.music_application.tables.pojos.Favourite;
import me.application.music.music_application.tables.records.FavouriteRecord;
import me.application.music.repository.AbsMysqlRepository;
import org.jooq.impl.TableImpl;
import org.springframework.stereotype.Repository;

import static me.application.music.music_application.tables.Favourite.FAVOURITE;

@Repository
public class FavouriteRepositoryImpl extends AbsMysqlRepository<Favourite, FavouriteRecord> {
    @Override
    public TableImpl<FavouriteRecord> getTable() {
        return FAVOURITE;
    }
}

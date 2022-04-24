package me.application.music.repository.impl;

import me.application.music.music_application.tables.pojos.Authenticate;
import me.application.music.music_application.tables.records.AuthenticateRecord;
import me.application.music.repository.AbsMysqlRepository;
import org.jooq.impl.TableImpl;
import org.springframework.stereotype.Repository;

import static me.application.music.music_application.tables.Authenticate.AUTHENTICATE;

@Repository
public class AuthenticateRepositoryImpl extends AbsMysqlRepository<Authenticate, AuthenticateRecord> {
    @Override
    public TableImpl<AuthenticateRecord> getTable() {
        return AUTHENTICATE;
    }
}

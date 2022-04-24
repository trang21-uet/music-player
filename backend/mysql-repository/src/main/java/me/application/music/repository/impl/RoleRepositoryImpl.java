package me.application.music.repository.impl;

import me.application.music.music_application.tables.pojos.Role;
import me.application.music.music_application.tables.records.RoleRecord;
import me.application.music.repository.AbsMysqlRepository;
import org.jooq.impl.TableImpl;
import org.springframework.stereotype.Repository;

import static me.application.music.music_application.tables.Role.ROLE;
@Repository
public class RoleRepositoryImpl extends AbsMysqlRepository<Role, RoleRecord> {
    @Override
    public TableImpl<RoleRecord> getTable() {
        return ROLE;
    }
}

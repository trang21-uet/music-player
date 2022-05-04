package me.application.music.repository.impl;

import me.application.music.music_application.tables.pojos.User;
import me.application.music.music_application.tables.records.UserRecord;
import me.application.music.repository.AbsMysqlRepository;
import org.jooq.impl.TableImpl;
import org.springframework.stereotype.Repository;

import static me.application.music.music_application.Tables.USER;

@Repository
public class UserReposotoryImpl extends AbsMysqlRepository<User, UserRecord> {
    @Override
    public TableImpl getTable() {
        return USER;
    }

    public User findByUsername(String userName) {
        return dslContext.select()
                .from(this.getTable())
                .where(USER.USERNAME.eq(userName))
                .fetchOneInto(this.pClass);
    }

    public Integer setRole(String id, Long roleId) {
        return dslContext.update(this.getTable())
                .set(USER.ROLE_ID, roleId)
                .where(USER.ID.eq(Long.valueOf(id)))
                .execute();
    }
}

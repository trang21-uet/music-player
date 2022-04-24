package me.application.music.repository.config.mysql;

import org.jooq.DSLContext;
import org.jooq.SQLDialect;
import org.jooq.impl.DSL;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.sql.Connection;

@Component
public class MySQLContext {
    private final Connection connection;

    public MySQLContext(Connection connection) {
        this.connection = connection;
    }

    @Bean
    public DSLContext dslContext() {
        return DSL.using(connection, SQLDialect.MYSQL);
    }

}

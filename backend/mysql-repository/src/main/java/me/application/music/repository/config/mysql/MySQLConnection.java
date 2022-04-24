package me.application.music.repository.config.mysql;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

@Data
@Component
@Configuration
@ConfigurationProperties("spring.mysql")
public class MySQLConnection {
    private String url;
    private String userName;
    private String password;

    @Bean
    public Connection getConnection() {
        try {
            return DriverManager.getConnection(url, userName, password);
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }
}

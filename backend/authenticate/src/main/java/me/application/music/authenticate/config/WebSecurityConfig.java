package me.application.music.authenticate.config;

import me.application.music.authenticate.filter.JwtAuthenticationFilter;
import me.application.music.authenticate.service.AuthenticateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.BeanIds;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired private AuthenticateService authenticateService;
    @Autowired private PasswordEncoder passwordEncoder;

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }

    @Bean(BeanIds.AUTHENTICATION_MANAGER)
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        // Get AuthenticationManager bean
        return super.authenticationManagerBean();
    }

    @Bean
    public RestAuthenticationEntryPoint restServicesEntryPoint() {
        return new RestAuthenticationEntryPoint();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth)
            throws Exception {
        auth.userDetailsService(authenticateService) // Cung cáp userservice cho spring security
                .passwordEncoder(passwordEncoder); // cung cấp password encoder
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .cors() // Ngăn chặn request từ một domain khác
                .and()
                .authorizeRequests()
                .antMatchers("/login",
                        "/songs",
                        "/songs/{id}",
                        "/images",
                        "/images/{id}",
                        "/signup").permitAll() // Cho phép tất cả mọi người truy cập vào địa chỉ này
                .antMatchers("/favourite", "/upload").hasAnyRole("user", "admin")
                .anyRequest().authenticated() // Tất cả các request khác đều cần phải xác thực mới được truy cập
                .and()
                .csrf().disable();

        // Thêm một lớp Filter kiểm tra jwt
        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        http.csrf().ignoringAntMatchers("/**");
        http.httpBasic().authenticationEntryPoint(restServicesEntryPoint());
    }
}

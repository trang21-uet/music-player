package me.application.music.authenticate.service;

import me.application.music.music_application.tables.pojos.Role;
import me.application.music.repository.impl.RoleRepositoryImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {
    @Autowired private RoleRepositoryImpl roleRepository;

    public List<Role> findAll() {
        return roleRepository.findAll();
    }

    public Role findById(String id) {
        return roleRepository.findById(id);
    }

    public Integer create(Role role) {
        return roleRepository.createOne(role);
    }

    public Integer delete(String id) {
        return roleRepository.delete(id);
    }
}

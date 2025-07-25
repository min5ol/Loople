package com.loople.backend.v2.domain.myAvatar.repository;

import com.loople.backend.v2.domain.myAvatar.entity.MyAvatar;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MyAvatarRepository extends JpaRepository<MyAvatar, Long>
{
    Optional<MyAvatar> findByUser_No(Long userNo);
}

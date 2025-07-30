package com.loople.backend.v2.domain.myAvatar.repository;

import com.loople.backend.v2.domain.avatarItem.entity.AvatarItem;
import com.loople.backend.v2.domain.avatarItem.entity.AvatarItemType;
import com.loople.backend.v2.domain.myAvatar.entity.MyAvatar;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MyAvatarRepository extends JpaRepository<MyAvatar, Long>
{}

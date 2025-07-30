package com.loople.backend.v2.domain.avatarItem.repository;

import com.loople.backend.v2.domain.avatarItem.entity.AvatarItem;
import com.loople.backend.v2.domain.avatarItem.entity.AvatarItemType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AvatarItemRepository extends JpaRepository<AvatarItem, Long>
{
    List<AvatarItem> findByTypeIn(List<AvatarItemType> types);
}

package com.loople.backend.v2.domain.myAvatarItem.repository;

import com.loople.backend.v2.domain.myAvatarItem.entity.MyAvatarItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MyAvatarItemRepository extends JpaRepository<MyAvatarItem, Long>
{
    List<MyAvatarItem> findByUser_No(Long userId);
    boolean existsByUser_NoAndAvatarItem_Id(Long userNo, Long avatarItemId);
}

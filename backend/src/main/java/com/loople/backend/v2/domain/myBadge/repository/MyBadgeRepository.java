package com.loople.backend.v2.domain.myBadge.repository;

import com.loople.backend.v2.domain.myBadge.entity.MyBadge;
import com.loople.backend.v2.domain.users.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MyBadgeRepository extends JpaRepository<MyBadge, Long>
{
    List<MyBadge> findByUser_No(Long userNo);
    MyBadge findByUser_NoAndIsEquippedTrue(Long userNo);
}

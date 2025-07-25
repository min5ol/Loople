package com.loople.backend.v2.domain.myRoom.repository;

import com.loople.backend.v2.domain.myRoom.entity.MyRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MyRoomRepository extends JpaRepository<MyRoom, Long>
{
    Optional<MyRoom> findByUser_No(Long userNo);
}

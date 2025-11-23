package com.example.employee_service_mama.repository;


import com.example.employee_service_mama.model.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository

public interface AnnouncementRepository extends JpaRepository<Announcement, Integer> {


}

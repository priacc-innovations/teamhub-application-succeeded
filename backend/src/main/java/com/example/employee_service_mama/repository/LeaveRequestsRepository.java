package com.example.employee_service_mama.repository;

import com.example.employee_service_mama.model.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveRequestsRepository extends JpaRepository<LeaveRequest, Integer> {

    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.user.id = :userId ORDER BY lr.createdAt DESC")
    List<LeaveRequest> findLeaveByUserId(@Param("userId") Integer userId);

    List<LeaveRequest> findAllByOrderByCreatedAtDesc();
}

package com.example.employee_service_mama.repository;

import com.example.employee_service_mama.model.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface WalletRepository extends JpaRepository<Wallet, Integer> {
    @Query("SELECT monthlySalary FROM Wallet e WHERE e.user.id=:userId")
    Float monthsalary(@Param("userId")Integer userId);
}

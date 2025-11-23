package com.example.employee_service_mama.service;

import com.example.employee_service_mama.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WalletService {
    @Autowired
    WalletRepository walletRepository;
    public Float monthsalary(Integer userId) {
        return walletRepository.monthsalary(userId);
    }
}

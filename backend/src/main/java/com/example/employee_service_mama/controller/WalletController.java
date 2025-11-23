package com.example.employee_service_mama.controller;

import com.example.employee_service_mama.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/salary")
@CrossOrigin("*")
public class WalletController {
    @Autowired
    WalletService walletService;
    @GetMapping("/monthsalary/{userId}")
    public Float monthsalary(@PathVariable Integer userId){
        return walletService.monthsalary(userId);
    }

}

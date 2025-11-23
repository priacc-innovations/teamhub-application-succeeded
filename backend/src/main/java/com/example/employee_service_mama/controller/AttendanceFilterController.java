package com.example.employee_service_mama.controller;

import com.example.employee_service_mama.model.AttendanceCsvFile;
import com.example.employee_service_mama.service.AttendanceFilterService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor

@CrossOrigin(
        origins = {
                "https://teamhub.in",
                "http://teamhub.in",
                "http://52.202.113.154:80",
                "http://127.0.0.1:5173"
        },
        allowCredentials = "true"
)

public class AttendanceFilterController {

    private final AttendanceFilterService service;

    @GetMapping("/hr-filter")
    public List<AttendanceCsvFile> filterAttendance(
            @RequestParam(required = false) String month,
            @RequestParam(required = false) String date
    ) {
        System.out.println(month + " " + date);
        return service.filterAttendance(month, date);
    }

    @PutMapping("/update-status/{id}")
    public String updateStatus(@PathVariable int id, @RequestBody AttendanceCsvFile req) {
        return service.updateStatus(id, req.getStatus());
    }

    @PutMapping("/update-bulk")
    public String updateBulk(@RequestBody List<AttendanceCsvFile> updates) {

        updates.forEach(update -> {
            service.updateStatus(update.getId(), update.getStatus());
        });

        return "Bulk update successful!";
    }

}


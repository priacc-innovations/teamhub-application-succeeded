package com.example.employee_service_mama.controller;

import com.example.employee_service_mama.model.Attendance;
import com.example.employee_service_mama.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")

@CrossOrigin(
        origins = {
                "https://teamhub.in",
                "http://teamhub.in",
                "http://52.202.113.154:80",
                "http://127.0.0.1:5173"
        },
        allowCredentials = "true"
)

@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Attendance>> getAttendanceByUserId(@PathVariable Integer userId) {
        return ResponseEntity.ok(attendanceService.getAttendanceByUserId(userId));
    }

    @GetMapping("/today/{userId}")
    public ResponseEntity<Attendance> getTodayAttendance(@PathVariable Integer userId) {
        return ResponseEntity.ok(attendanceService.getTodayAttendance(userId));
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<Attendance>> getAttendanceHistory(@PathVariable Integer userId) {
        return ResponseEntity.ok(attendanceService.getAttendancehistory(userId));
    }

    @GetMapping("/presentdays/{userId}")
    public ResponseEntity<Integer> getPresentDays(@PathVariable Integer userId) {
        return ResponseEntity.ok(attendanceService.presentdays(userId));
    }

    @GetMapping("/absentdays/{userId}")
    public ResponseEntity<Integer> getAbsentDays(@PathVariable Integer userId) {
        return ResponseEntity.ok(attendanceService.absentdays(userId));
    }

    @GetMapping("/halfdays/{userId}")
    public ResponseEntity<Integer> getHalfDays(@PathVariable Integer userId) {
        return ResponseEntity.ok(attendanceService.halfdays(userId));
    }

    @GetMapping("/late/{userId}")
    public ResponseEntity<Integer> getLateDays(@PathVariable Integer userId) {
        return ResponseEntity.ok(attendanceService.late(userId));
    }

    @PostMapping("/login/{userId}")
    public ResponseEntity<String> login(@PathVariable Integer userId) {
        return ResponseEntity.ok(attendanceService.login(userId));
    }

    @PutMapping("/logout/{userId}")
    public ResponseEntity<String> logout(@PathVariable Integer userId) {
        return ResponseEntity.ok(attendanceService.logout(userId));
    }
}


package com.example.employee_service_mama.service;

import com.example.employee_service_mama.model.Attendance;
import com.example.employee_service_mama.model.Users;
import com.example.employee_service_mama.repository.AttendanceRepository;
import com.example.employee_service_mama.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;

    private final LocalTime OFFICE_START = LocalTime.of(9, 5);
    private final LocalTime OFFICE_END = LocalTime.of(18, 0);


    // ================== OLD API — NEW LOGIC ==================

    // OLD → returns ALL attendance list
    public List<Attendance> getAttendanceByUserId(Integer userId) {
        return attendanceRepository.findAttendanceHistory(userId);
    }

    // OLD → returns today's attendance only
    public Attendance getTodayAttendance(Integer userId) {
        return attendanceRepository.findByUserIdAndDate(userId, LocalDate.now());
    }

    // OLD → Present days
    public Integer presentdays(Integer userId) {
        return attendanceRepository.findByPresentDays(userId);
    }

    // NEW → Absent days
    public Integer absentdays(Integer userId) {
        return attendanceRepository.findByAbsentDays(userId);
    }

    // NEW → Half days
    public Integer halfdays(Integer userId) {
        return attendanceRepository.findByHalfDays(userId);
    }

    // NEW → Late login count
    public Integer late(Integer userId) {
        return attendanceRepository.findLateLoginDays(userId, OFFICE_START);
    }


    // ================== LOGIN (old API, new logic) ==================
    public String login(Integer userId) {

        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        // WEEKEND CHECK
        if (isWeekend(today)) {
            String remark = today.getDayOfWeek().name().equals("SATURDAY")
                    ? "Weekend - Saturday"
                    : "Weekend - Sunday";

            Attendance exist = attendanceRepository.findByUserIdAndDate(userId, today);
            if (exist != null) return "Already marked";

            Attendance weekend = Attendance.builder()
                    .user(user)
                    .date(today)
                    .status(remark)
                    .remarks(remark)
                    .build();

            attendanceRepository.save(weekend);
            return remark;
        }

        Attendance existing = attendanceRepository.findByUserIdAndDate(userId, today);
        if (existing != null) {
            return "Already logged in today";
        }

        // NEW LOGIN LOGIC
        String status;
        if (now.isAfter(OFFICE_END)) {
            status = "ABSENT";
        } else if (now.isAfter(OFFICE_START)) {
            status = "HALF_DAY";
        } else {
            status = "PRESENT";
        }

        Attendance att = Attendance.builder()
                .user(user)
                .date(today)
                .loginTime(now)
                .status(status)
                .remarks("Login: " + status)
                .build();

        attendanceRepository.save(att);
        return "Login recorded successfully";
    }


    // ================== LOGOUT (old API, new logic) ==================
    public String logout(Integer userId) {

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        if (isWeekend(today)) return "Weekend – no logout needed";

        Attendance att = attendanceRepository.findByUserIdAndDate(userId, today);

        // If logout without login → mark ABSENT
        if (att == null) {
            Users user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Attendance absent = Attendance.builder()
                    .user(user)
                    .date(today)
                    .logoutTime(now)
                    .status("ABSENT")
                    .remarks("Logged out without login")
                    .build();

            attendanceRepository.save(absent);
            return "Marked absent (no login found)";
        }

        // NEW LOGIC: early logout = HALF_DAY
        if (!"ABSENT".equals(att.getStatus())) {
            if (now.isBefore(OFFICE_END)) {
                att.setStatus("HALF_DAY");
            } else if (!"HALF_DAY".equals(att.getStatus())) {
                att.setStatus("PRESENT");
            }
        }

        att.setLogoutTime(now);
        att.setRemarks("Logout: " + att.getStatus());
        attendanceRepository.save(att);

        return "Logout updated";
    }


    // ================== HISTORY (new logic) ==================
    public List<Attendance> getAttendancehistory(Integer userId) {
        return attendanceRepository.findAttendanceHistory(userId);
    }


    // ================== AUTO ABSENT AT 6 PM ==================
    @Scheduled(cron = "0 0 18 * * *") // 6:00 PM daily
    public void markAbsentForNonLoggedUsers() {

        LocalDate today = LocalDate.now();
        if (isWeekend(today)) return;

        List<Users> users = userRepository.findAll();

        for (Users user : users) {

            boolean logged =
                    attendanceRepository.existsByUserIdAndDate(user.getId(), today);

            if (!logged) {
                Attendance absent = Attendance.builder()
                        .user(user)
                        .date(today)
                        .status("ABSENT")
                        .remarks("Auto absent marked at 6 PM")
                        .build();

                attendanceRepository.save(absent);
            }
        }
    }


    // ================== WEEKEND ABSENT FIX ==================
    @Scheduled(cron = "0 10 0 * * *")  // daily at 12:10 AM
    public void fixWeekendAbsents() {

        LocalDate today = LocalDate.now();
        List<Users> users = userRepository.findAll();

        // CASE 1: SATURDAY / SUNDAY → check Friday
        if (today.getDayOfWeek().name().equals("SATURDAY")
                || today.getDayOfWeek().name().equals("SUNDAY")) {

            LocalDate friday = today.getDayOfWeek().name().equals("SATURDAY")
                    ? today.minusDays(1)
                    : today.minusDays(2);

            for (Users user : users) {
                Attendance fri = attendanceRepository.findByUserIdAndDate(user.getId(), friday);

                if (fri != null && "ABSENT".equals(fri.getStatus())) {
                    markAbsentIfNotExists(user, today, "Absent due to Friday absent");
                }
            }
        }

        // CASE 2: MONDAY → check Saturday & Sunday
        if (today.getDayOfWeek().name().equals("MONDAY")) {

            LocalDate sat = today.minusDays(2);
            LocalDate sun = today.minusDays(1);

            for (Users user : users) {
                Attendance mon = attendanceRepository.findByUserIdAndDate(user.getId(), today);

                if (mon != null && "ABSENT".equals(mon.getStatus())) {
                    markAbsentIfNotExists(user, sat, "Absent due to Monday absent");
                    markAbsentIfNotExists(user, sun, "Absent due to Monday absent");
                }
            }
        }
    }

    private void markAbsentIfNotExists(Users user, LocalDate date, String remark) {
        Attendance exist = attendanceRepository.findByUserIdAndDate(user.getId(), date);

        if (exist == null) {
            Attendance absent = Attendance.builder()
                    .user(user)
                    .date(date)
                    .status("ABSENT")
                    .remarks(remark)
                    .build();

            attendanceRepository.save(absent);
        }
    }


    // ================== UTILITY ==================
    private boolean isWeekend(LocalDate date) {
        return date.getDayOfWeek().name().equals("SATURDAY")
                || date.getDayOfWeek().name().equals("SUNDAY");
    }
}

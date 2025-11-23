package com.example.employee_service_mama.service;

import com.example.employee_service_mama.model.AttendanceCsvFile;
import com.example.employee_service_mama.model.Users;
import com.example.employee_service_mama.repository.AttendanceCsvFileRepository;
import com.example.employee_service_mama.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Month;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceCsvFileService {

    private final AttendanceCsvFileRepository repo;
    private final UserRepository userRepo;

    // ===========================
    // OLD LOGIC → Save Bulk Upload
    // ===========================
//

    public String saveBulk(List<AttendanceCsvFile> sheetRecords) {

        if (sheetRecords == null || sheetRecords.isEmpty()) {
            return "Sheet is empty!";
        }

        // FIX: Extract correct date
        String recordDate = sheetRecords.stream()
                .map(AttendanceCsvFile::getDate)
                .filter(Objects::nonNull)
                .filter(d -> !d.isBlank())
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Invalid date in sheet"));

        // Prevent duplicate
        List<AttendanceCsvFile> existing = repo.findByDate(recordDate);
        if (!existing.isEmpty()) {
            return "Attendance for this date already exists!";
        }

        List<Users> allEmployees = userRepo.findAll();

        Set<String> sheetEmpIds = sheetRecords.stream()
                .map(AttendanceCsvFile::getEmployeeId)
                .collect(Collectors.toSet());

        // Always set PRESENT date
        sheetRecords.forEach(r -> {
            r.setStatus("Present");
            r.setDate(recordDate);
        });

        List<AttendanceCsvFile> absentees = new ArrayList<>();

        for (Users emp : allEmployees) {
            if (!sheetEmpIds.contains(emp.getEmpid())) {

                absentees.add(
                        AttendanceCsvFile.builder()
                                .employeeId(emp.getEmpid())
                                .name(emp.getFullName())
                                .domain(emp.getDomain())
                                .date(recordDate)       // ALWAYS ADD DATE
                                .status("Absent")
                                .build()
                );
            }
        }

        repo.saveAll(sheetRecords);
        repo.saveAll(absentees);

        return "Attendance processed for " + recordDate;
    }



    // OLD
    public List<AttendanceCsvFile> getAll() {
        return repo.findAll();
    }



    // ===========================
    // NEW LOGIC → Filter Attendance
    // ===========================
    public List<AttendanceCsvFile> filterAttendance(String month, String date) {

        List<AttendanceCsvFile> all = repo.findAll();

        // Filter by Month
        if (month != null && !month.isEmpty()) {

            int monthIndex = Month.valueOf(month.toUpperCase()).getValue();

            all = all.stream()
                    .filter(a -> {
                        try {
                            return Integer.parseInt(a.getDate().substring(0, 2)) == monthIndex;
                        } catch (Exception e) {
                            return false;
                        }
                    })
                    .collect(Collectors.toList());
        }

        // Filter by Date
        if (date != null && !date.isEmpty()) {
            all = all.stream()
                    .filter(a -> a.getDate().equals(date))
                    .collect(Collectors.toList());
        }

        return all;
    }



    // ===========================
    // NEW LOGIC → Update Status
    // ===========================
    public String updateStatus(int id, String newStatus) {
        AttendanceCsvFile row = repo.findById(id).orElse(null);
        if (row == null) return "Record not found";

        row.setStatus(newStatus);
        repo.save(row);

        return "Status updated";
    }
}

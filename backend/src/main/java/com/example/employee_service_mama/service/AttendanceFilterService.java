package com.example.employee_service_mama.service;

import com.example.employee_service_mama.model.AttendanceCsvFile;
import com.example.employee_service_mama.repository.AttendanceCsvFileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Month;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceFilterService {

    private final AttendanceCsvFileRepository repo;

    public List<AttendanceCsvFile> filterAttendance(String month, String date) {

        List<AttendanceCsvFile> all = repo.findAll();

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

        if (date != null && !date.isEmpty()) {
            all = all.stream()
                    .filter(a -> a.getDate().equals(date))
                    .collect(Collectors.toList());
        }

        return all;
    }

    public String updateStatus(int id, String newStatus) {
        AttendanceCsvFile row = repo.findById(id).orElse(null);
        if (row == null) return "Record not found";

        row.setStatus(newStatus);
        repo.save(row);

        return "Status updated";
    }
}


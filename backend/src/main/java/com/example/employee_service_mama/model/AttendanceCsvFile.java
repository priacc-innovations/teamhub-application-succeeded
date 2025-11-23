package com.example.employee_service_mama.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "attendance_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceCsvFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "empid")
    private String employeeId;

    @Column(name = "name")
    private String name;

    @Column(name = "date")
    private String date;

    @Column(name = "domain")
    private String domain;

    @Column(name = "status")
    private String status; // Present / Absent
}

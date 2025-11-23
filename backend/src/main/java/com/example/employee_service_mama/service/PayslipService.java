package com.example.employee_service_mama.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.employee_service_mama.model.Payslip;
import com.example.employee_service_mama.model.PayslipDto;
import com.example.employee_service_mama.model.Users;
import com.example.employee_service_mama.repository.PayslipRepository;
import com.example.employee_service_mama.repository.UserRepository;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.Month;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PayslipService {

    private final PayslipRepository repo;
    private final UserRepository userRepo;
    private final Cloudinary cloudinary;

    // ---------------- UPLOAD ----------------
//    public Payslip upload(String empid, Integer month, Integer year, MultipartFile file) throws Exception {
//
//        Users user = userRepo.findByEmpid(empid)
//                .orElseThrow(() -> new RuntimeException("User not found: " + empid));
//
//        // delete old same month/year
//        repo.findByEmpidAndMonthAndYear(empid, month, year)
//                .forEach(repo::delete);
//
//        String cleanName = user.getFullName().trim();
//        String fileName = empid + " - " + cleanName + ".pdf";
//
//        // Folder Example: priacc_payslips/November_2025
//        String monthName = Month.of(month).name();
//        String monthTitle = monthName.charAt(0) + monthName.substring(1).toLowerCase();
//        String folderName = "priacc_payslips/" + monthTitle + "_" + year;
//
//        // Cloudinary Public ID
//        String publicId = (empid + "-" + cleanName).replaceAll("\\s+", "_");
//
//        // ---- Upload as private file ----
//        Map uploadResult = cloudinary.uploader().upload(
//                file.getBytes(),
//                ObjectUtils.asMap(
//                        "resource_type", "raw",
//                        "type", "authenticated",
//                        "folder", folderName,
//                        "public_id", publicId
//                )
//        );
//
//        String cloudinaryPublicId = uploadResult.get("public_id").toString();
//
//        // ---- Save into database ----
//        Payslip payslip = Payslip.builder()
//                .empid(empid)
//                .fullName(cleanName)
//                .month(month)
//                .year(year)
//                .fileName(fileName)
//                .cloudinaryPublicId(cloudinaryPublicId)
//                .uploadedOn(LocalDate.now())
//                .build();
//
//        return repo.save(payslip);
//    }
//
        //NEW THINGS ADD BY VENKATASAGAR ***********************
    public Payslip upload(String empid, Integer month, Integer year, MultipartFile file) throws Exception {

        Users user = userRepo.findByEmpid(empid)
                .orElseThrow(() -> new RuntimeException("User not found: " + empid));

        String fullName = user.getFullName().trim();
        String sanitizedName = fullName.replaceAll("\\s+", "_");

        int safeMonth = (month >= 1 && month <= 12) ? month : LocalDate.now().getMonthValue();

        String monthName = Month.of(safeMonth).name();
        String monthTitle = monthName.charAt(0) + monthName.substring(1).toLowerCase();

        String folderName = "priacc_payslips/" + monthTitle + "_" + year;

        // Cloudinary public_id (NO EXTENSION)
        String publicId = folderName + "/" + empid + "-" + sanitizedName;

        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "resource_type", "raw",
                        "type", "authenticated",
                        "public_id", publicId,
                        "folder", folderName
                )
        );

        String savedPublicId = uploadResult.get("public_id").toString();

        Payslip payslip = Payslip.builder()
                .empid(empid)
                .fullName(fullName)
                .month(safeMonth)
                .year(year)
                .fileName(empid + "-" + fullName + ".pdf")
                .cloudinaryPublicId(savedPublicId)
                .uploadedOn(LocalDate.now())
                .build();

        return repo.save(payslip);
    }



    // ---------------- PRIVATE SIGNED URL ----------------
//    public String generateSignedUrl(Integer id) throws Exception {
//        Payslip p = repo.findById(id).orElse(null);
//
//        if (p == null || p.getCloudinaryPublicId() == null)
//            return null;
//
//        long expiresAt = (System.currentTimeMillis() / 1000L) + 3600;
//
//        Map<String, Object> params = ObjectUtils.asMap(
//                "public_id", p.getCloudinaryPublicId(),
//                "resource_type", "raw",
//                "type", "authenticated",
//                "expires_at", expiresAt
//        );
//
//        String signature = cloudinary.apiSignRequest(params, cloudinary.config.apiSecret);
//
//        return "https://res.cloudinary.com/"
//                + cloudinary.config.cloudName
//                + "/raw/authenticated/"
//                + p.getCloudinaryPublicId()
//                + "?expires_at=" + expiresAt
//                + "&signature=" + signature
//                + "&api_key=" + cloudinary.config.apiKey;
//    }

    public String generateSignedUrl(Integer id) throws Exception {
        Payslip p = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Payslip not found"));

        String publicId = p.getCloudinaryPublicId();  // EXACT path stored in Cloudinary

        long expiresAt = (System.currentTimeMillis() / 1000L) + 3600;

        Map<String, Object> params = new HashMap<>();
        params.put("public_id", publicId);
        params.put("resource_type", "raw");
        params.put("type", "authenticated");
        params.put("expires_at", expiresAt);

        String signature = cloudinary.apiSignRequest(params, cloudinary.config.apiSecret);

        return "https://res.cloudinary.com/" + cloudinary.config.cloudName
                + "/raw/authenticated/" + publicId
                + "?api_key=" + cloudinary.config.apiKey
                + "&expires_at=" + expiresAt
                + "&signature=" + signature;
    }








    // -------- DTO List --------
    public List<PayslipDto> getPayslipDtos(String empid) {
        return repo.findByEmpidOrderByYearDescMonthDesc(empid)
                .stream()
                .map(p -> new PayslipDto(
                        p.getId(),
                        p.getMonth(),
                        p.getYear(),
                        p.getFileName(),
                        p.getUploadedOn(),
                        p.getEmpid(),
                        p.getFullName()
                ))
                .toList();
    }
}

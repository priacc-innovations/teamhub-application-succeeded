package com.example.employee_service_mama.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.employee_service_mama.model.Users;
import com.example.employee_service_mama.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final Cloudinary cloudinary;

    // LOGIN
    public Users signin(String email, String password) {
        return userRepository.findByEmail(email, password).orElse(null);
    }

    // GET BY ID
    public Users getUserById(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // UPDATE PROFILE
    public Users updateProfile(Integer id, Users data) {
        Users user = getUserById(id);

        user.setFullName(data.getFullName());
        user.setEmail(data.getEmail());
        user.setPhone(data.getPhone());
        user.setDob(data.getDob());
        user.setAddress1(data.getAddress1());
        user.setAddress2(data.getAddress2());
        user.setCity(data.getCity());
        user.setState(data.getState());
        user.setCountry(data.getCountry());
        user.setPincode(data.getPincode());

        return userRepository.save(user);
    }

    // UPLOAD PHOTO + RETURN URL
    public String uploadPhoto(Integer id, MultipartFile file) {
        try {
            Map upload = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap("folder", "mama_users")
            );

            String imageUrl = upload.get("secure_url").toString();

            Users user = getUserById(id);
            user.setPhotoUrl(imageUrl);
            userRepository.save(user);

            return imageUrl;

        } catch (IOException e) {
            throw new RuntimeException("Upload failed!");
        }
    }

    public List<Users> getAllUsers() {
        return userRepository.findAll();
    }

    public Users addEmployee(Users data) {
        return userRepository.save(data);
    }

    // ADDED BY VENKATASAGAR FOR BULK ATTDANCE MODULE
    public List<Users> addBulkEmployees(List<Users> users) {
        return userRepository.saveAll(users);
    }

}

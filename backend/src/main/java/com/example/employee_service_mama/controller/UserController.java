package com.example.employee_service_mama.controller;

import com.example.employee_service_mama.model.Users;
import com.example.employee_service_mama.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/user")
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

public class UserController {

    private final UserService userService;

    @PostMapping("/signin")
    public Users signin(@RequestBody Map<String, String> map) {
        return userService.signin(map.get("email"), map.get("password"));
    }

    @GetMapping("/{id}")
    public Users getUser(@PathVariable Integer id) {
        return userService.getUserById(id);
    }

    @PutMapping("/update-profile/{id}")
    public Users updateProfile(@PathVariable Integer id, @RequestBody Users data) {
        return userService.updateProfile(id, data);
    }

    @PostMapping("/upload-photo/{id}")
    public Map<String, String> uploadPhoto(
            @PathVariable Integer id,
            @RequestParam("photo") MultipartFile file
    ) {
        String url = userService.uploadPhoto(id, file);
        return Map.of("url", url);
    }

    @GetMapping("/all")
    public List<Users> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping("/add")
    public Users addEmployee(@RequestBody Users user) {
        return userService.addEmployee(user);
    }

    @PostMapping("/add-bulk")
    public List<Users> addBulkEmployees(@RequestBody List<Users> users) {
        return userService.addBulkEmployees(users);
    }

}


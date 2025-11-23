// src/main/java/com/example/employee_service_mama/config/CloudinaryConfig.java
package com.example.employee_service_mama.config;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Value("${cloudinary.cloud_name}")
    private String cloudName;

    @Value("${cloudinary.api_key}")
    private String apiKey;

    @Value("${cloudinary.api_secret}")
    private String apiSecret;

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(Map.of(
                "cloud_name", "dyah7lunq",
                "api_key", "532513637915677",
                "api_secret", "TyXC_jdmVzYHiFAl9qIiOtro4CE",
                "secure", true
        ));
    }
}

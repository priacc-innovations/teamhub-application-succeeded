package com.example.employee_service_mama.kafka;

import com.example.employee_service_mama.model.Users;
import com.example.employee_service_mama.repository.UserRepository;
import com.example.employee_service_mama.service.WebSocketService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class AnnouncementConsumer {

    @Autowired
    private  WebSocketService webSocketService;
    @Autowired
    private  UserRepository userRepository;

    @KafkaListener(topics = "employee_service.public.announcement", groupId = "employee_group")
    public void consume(String message) throws Exception {
        JsonNode after = new ObjectMapper().readTree(message).get("after");
        if (after != null) {
            String targetRole = after.get("targetRole").asText();
            if (targetRole.equalsIgnoreCase("all")) {
                userRepository.findAll().forEach(user ->
                        webSocketService.sendMessage("/topic/announcement/" + user.getId(), message)
                );
            } else {
                userRepository.findAll().stream()
                        .filter(u -> u.getRole().equalsIgnoreCase(targetRole))
                        .forEach(user ->
                                webSocketService.sendMessage("/topic/announcement/" + user.getId(), message)
                        );
            }
        }
    }
}

package com.hackathon.ETimes.client;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;

@Service
public class LLMClient {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String BASE_URL = "http://localhost:8000/llm";

    public Object getRecommendation(double aqi, String location) {
        try {
            Map<String, Object> request = new HashMap<>();
            request.put("aqi", aqi);
            request.put("location", location);
            return restTemplate.postForObject(BASE_URL + "/recommendations", request, Object.class);
        } catch (Exception e) {
            return Map.of("recommendations", "LLM recommendation unavailable: " + e.getMessage());
        }
    }

    public Object getHealthAdvisor(double aqi, String location, String demographics) {
        try {
            Map<String, Object> request = new HashMap<>();
            request.put("aqi", aqi);
            request.put("location", location);
            request.put("demographics", demographics);
            return restTemplate.postForObject(BASE_URL + "/health-advisor", request, Object.class);
        } catch (Exception e) {
            return Map.of("advice", "LLM health advisor unavailable: " + e.getMessage());
        }
    }

    public Object askCopilot(String message, Object history) {
        try {
            Map<String, Object> request = new HashMap<>();
            request.put("message", message);
            request.put("history", history);
            return restTemplate.postForObject(BASE_URL + "/copilot", request, Object.class);
        } catch (Exception e) {
            return Map.of("reply", "LLM copilot unavailable: " + e.getMessage());
        }
    }

    public Object generateReport(double aqi, String location) {
        try {
            Map<String, Object> request = new HashMap<>();
            request.put("aqi", aqi);
            request.put("location", location);
            return restTemplate.postForObject(BASE_URL + "/report", request, Object.class);
        } catch (Exception e) {
            return Map.of("report", "LLM report generation unavailable: " + e.getMessage());
        }
    }
}
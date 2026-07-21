package com.hackathon.ETimes.client;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class EnvironmentClient {

    private final RestTemplate restTemplate = new RestTemplate();

    public Object analyzeEnvironment(double lat, double lon) {
        try {
            String url = "http://localhost:8000/attribution?lat=" + lat + "&lon=" + lon;
            return restTemplate.getForObject(url, Object.class);
        } catch (Exception e) {
            return "Environment Source Attribution Service unavailable: " + e.getMessage();
        }
    }
}
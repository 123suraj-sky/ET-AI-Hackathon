package com.hackathon.ETimes.client;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class WeatherClient {

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Fetches live current conditions (AQI, status, temperature, humidity, windSpeed)
     * from the Python AI service's /current endpoint, which in turn calls OpenWeatherMap.
     */
    public Map<String, Object> getCurrentConditions(double lat, double lon) {
        try {
            String url = "http://localhost:8000/current?lat=" + lat + "&lon=" + lon;
            @SuppressWarnings("unchecked")
            Map<String, Object> result = restTemplate.getForObject(url, Map.class);
            return result != null ? result : fallback();
        } catch (Exception e) {
            System.err.println("WeatherClient: /current unavailable — " + e.getMessage());
            return fallback();
        }
    }

    private Map<String, Object> fallback() {
        return Map.of(
            "currentAqi", "N/A",
            "status",     "Unavailable",
            "temperature","N/A",
            "humidity",   "N/A",
            "windSpeed",  "N/A"
        );
    }
}

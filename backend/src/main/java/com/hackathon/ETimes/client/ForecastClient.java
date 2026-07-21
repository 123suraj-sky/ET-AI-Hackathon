package com.hackathon.ETimes.client;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ForecastClient {

    private final RestTemplate restTemplate = new RestTemplate();

    public Object getForecast(double lat, double lon) {
        try {
            String url = "http://localhost:8000/forecast?lat=" + lat + "&lon=" + lon;
            return restTemplate.getForObject(url, Object.class);
        } catch (Exception e) {
            return "ARIMA Forecast Service unavailable: " + e.getMessage();
        }
    }
}
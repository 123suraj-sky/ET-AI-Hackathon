package com.hackathon.ETimes.client;

import org.springframework.stereotype.Service;

@Service
public class ForecastClient {

    public String getForecast(double lat, double lon) {
        return "Forecast service";
    }
}
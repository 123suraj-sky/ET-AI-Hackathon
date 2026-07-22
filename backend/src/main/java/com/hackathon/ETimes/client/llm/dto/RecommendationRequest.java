package com.hackathon.ETimes.client.llm.dto;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class RecommendationRequest {

    private String city;
    private Integer aqi;
    private Weather weather;
    private PollutionSources pollutionSources;
    private List<Forecast> forecast;

    @Data
    public static class Weather {
        private Double temperature;
        private Double humidity;
        private Double windSpeed;
    }

    @Data
    public static class PollutionSources {
        private Integer traffic;
        private Integer industry;
        private Integer construction;
        private Integer cropBurning;
    }

    @Data
    public static class Forecast {
        private String date;
        private Integer aqi;
    }
}
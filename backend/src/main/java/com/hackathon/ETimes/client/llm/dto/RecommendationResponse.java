package com.hackathon.ETimes.client.llm.dto;

import lombok.Data;

import java.util.List;

@Data
public class RecommendationResponse {

    private boolean success;
    private String message;
    private DataResponse data;

    @Data
    public static class DataResponse {
        private String summary;
        private Recommendations recommendations;
    }

    @Data
    public static class Recommendations {
        private List<String> highPriority;
        private List<String> mediumPriority;
        private List<String> lowPriority;
    }
}
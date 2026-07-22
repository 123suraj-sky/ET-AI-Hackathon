package com.hackathon.ETimes.client.llm;

import com.hackathon.ETimes.client.llm.dto.RecommendationRequest;
import com.hackathon.ETimes.client.llm.dto.RecommendationResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class LLMClient {

    private final RestClient restClient;

    public LLMClient(
            RestClient.Builder restClientBuilder,
            @Value("${llm.service.base-url}") String baseUrl) {

        this.restClient = restClientBuilder
                .baseUrl(baseUrl)
                .build();
    }

    public RecommendationResponse getRecommendations(
            RecommendationRequest request) {

        return restClient
                .post()
                .uri("/api/llm/recommendations")
                .body(request)
                .retrieve()
                .body(RecommendationResponse.class);
    }
}
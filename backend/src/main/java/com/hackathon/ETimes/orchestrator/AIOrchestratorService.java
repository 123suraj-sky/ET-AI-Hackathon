package com.hackathon.ETimes.orchestrator;

import com.hackathon.ETimes.analysis.dto.AnalysisRequest;
import com.hackathon.ETimes.analysis.dto.AnalysisResponse;
import com.hackathon.ETimes.client.EnvironmentClient;
import com.hackathon.ETimes.client.ForecastClient;
import com.hackathon.ETimes.client.LLMClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AIOrchestratorService {

    private final ForecastClient forecastClient;
    private final EnvironmentClient environmentClient;
    private final LLMClient llmClient;

    public AnalysisResponse analyze(AnalysisRequest request) {
        double lat = request.getLatitude() != null ? request.getLatitude() : 28.6139;
        double lon = request.getLongitude() != null ? request.getLongitude() : 77.2090;

        Object forecast = forecastClient.getForecast(lat, lon);
        Object environment = environmentClient.analyzeEnvironment(lat, lon);
        
        // Pass average or default AQI to LLM recommendation
        double aqi = 250.0; 
        Object recommendation = llmClient.getRecommendation(aqi, "Delhi");

        return AnalysisResponse.builder()
                .forecast(forecast)
                .environment(environment)
                .recommendation(recommendation)
                .build();
    }
}
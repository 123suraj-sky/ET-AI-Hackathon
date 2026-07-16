package com.hackathon.ETimes.orchestrator;


import com.hackathon.ETimes.analysis.dto.AnalysisRequest;
import com.hackathon.ETimes.analysis.dto.AnalysisResponse;
import org.springframework.stereotype.Service;

@Service
public class AIOrchestratorService {

    public AnalysisResponse analyze(AnalysisRequest request) {

        return AnalysisResponse.builder()
                .forecast("Forecast service not connected")
                .environment("Environment service not connected")
                .recommendation("LLM service not connected")
                .build();
    }
}
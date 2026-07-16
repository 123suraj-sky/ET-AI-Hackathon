package com.hackathon.ETimes.analysis.service;

import com.hackathon.ETimes.analysis.dto.AnalysisRequest;
import com.hackathon.ETimes.analysis.dto.AnalysisResponse;
import com.hackathon.ETimes.orchestrator.AIOrchestratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AnalysisService {

    private final AIOrchestratorService orchestratorService;

    public AnalysisResponse analyze(AnalysisRequest request) {
        return orchestratorService.analyze(request);
    }
}
package com.hackathon.ETimes.analysis.controller;

import com.hackathon.ETimes.analysis.dto.AnalysisRequest;
import com.hackathon.ETimes.analysis.dto.AnalysisResponse;
import com.hackathon.ETimes.analysis.service.AnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analysis")
@RequiredArgsConstructor
public class AnalysisController {

    private final AnalysisService analysisService;

    @PostMapping
    public ResponseEntity<AnalysisResponse> analyze(
            @RequestBody AnalysisRequest request) {

        return ResponseEntity.ok(
                analysisService.analyze(request)
        );
    }
}
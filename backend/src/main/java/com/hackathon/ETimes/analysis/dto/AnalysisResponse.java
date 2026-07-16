package com.hackathon.ETimes.analysis.dto;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AnalysisResponse {

    private Object forecast;

    private Object environment;

    private Object recommendation;
}
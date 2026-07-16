package com.hackathon.ETimes.client;

import org.springframework.stereotype.Service;

@Service
public class EnvironmentClient {

    public String analyzeEnvironment(double lat, double lon) {
        return "Environment service";
    }
}
package com.hackathon.ETimes.analysis.controller;

import com.hackathon.ETimes.client.EnvironmentClient;
import com.hackathon.ETimes.client.ForecastClient;
import com.hackathon.ETimes.client.LLMClient;
import com.hackathon.ETimes.client.WeatherClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ApiController {

    private final ForecastClient forecastClient;
    private final EnvironmentClient environmentClient;
    private final LLMClient llmClient;
    private final WeatherClient weatherClient;

    @GetMapping("/dashboard")
    public ResponseEntity<Object> getDashboard() {
        Map<String, Object> data = new HashMap<>();

        // Live current conditions: AQI, status, temperature, humidity, windSpeed
        Map<String, Object> current = weatherClient.getCurrentConditions(28.6139, 77.2090);
        data.putAll(current);

        // Attribution & forecast from the Python AI service
        data.put("attribution", environmentClient.analyzeEnvironment(28.6139, 77.2090));
        data.put("forecast", forecastClient.getForecast(28.6139, 77.2090));

        // Also expose a flattened recommendation via LLM (optional — passes live AQI)
        Object aqiRaw = current.get("currentAqi");
        double aqi = (aqiRaw instanceof Number) ? ((Number) aqiRaw).doubleValue() : 248.0;
        data.put("recommendation", llmClient.getRecommendation(aqi, "Delhi"));

        return ResponseEntity.ok(data);
    }

    @GetMapping("/forecast")
    public ResponseEntity<Object> getForecast() {
        return ResponseEntity.ok(forecastClient.getForecast(28.6139, 77.2090));
    }

    @GetMapping("/source-analysis")
    public ResponseEntity<Object> getSourceAnalysis() {
        return ResponseEntity.ok(environmentClient.analyzeEnvironment(28.6139, 77.2090));
    }

    @PostMapping("/llm/recommendations")
    public ResponseEntity<Object> getRecommendations(@RequestBody Map<String, Object> body) {
        double aqi = body.containsKey("aqi") ? Double.parseDouble(body.get("aqi").toString()) : 248.0;
        String location = body.containsKey("location") ? body.get("location").toString() : "Delhi";
        return ResponseEntity.ok(llmClient.getRecommendation(aqi, location));
    }

    @PostMapping("/llm/health-advisor")
    public ResponseEntity<Object> getHealthAdvisor(@RequestBody Map<String, Object> body) {
        double aqi = body.containsKey("aqi") ? Double.parseDouble(body.get("aqi").toString()) : 248.0;
        String location = body.containsKey("location") ? body.get("location").toString() : "Delhi";
        String demographics = body.containsKey("demographics") ? body.get("demographics").toString() : "General";
        return ResponseEntity.ok(llmClient.getHealthAdvisor(aqi, location, demographics));
    }

    @PostMapping("/llm/copilot")
    public ResponseEntity<Object> askCopilot(@RequestBody Map<String, Object> body) {
        String message = body.containsKey("message") ? body.get("message").toString() : "";
        Object history = body.getOrDefault("history", null);
        return ResponseEntity.ok(llmClient.askCopilot(message, history));
    }

    @PostMapping("/llm/report")
    public ResponseEntity<Object> generateReport(@RequestBody Map<String, Object> body) {
        double aqi = body.containsKey("aqi") ? Double.parseDouble(body.get("aqi").toString()) : 248.0;
        String location = body.containsKey("location") ? body.get("location").toString() : "Delhi";
        return ResponseEntity.ok(llmClient.generateReport(aqi, location));
    }
}

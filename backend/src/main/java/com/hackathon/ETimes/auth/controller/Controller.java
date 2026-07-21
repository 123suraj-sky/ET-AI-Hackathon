package com.hackathon.ETimes.auth.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class Controller {

    @GetMapping("/hello")
    public String hello() {
        return "Hello, World!";
    }

}

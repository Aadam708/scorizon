package com.Scorizon.Scorizon.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Scorizon.Scorizon.dto.PredictionDto;
import com.Scorizon.Scorizon.security.JwtUtil;
import com.Scorizon.Scorizon.service.PredictionService;

@RestController
@RequestMapping("api/predictions")
public class PredictionController {

    private PredictionService predictionService;
    private JwtUtil jwtUtil;


    public PredictionController(PredictionService predictionService, JwtUtil jwtUtil) {
        this.predictionService = predictionService;
        this.jwtUtil = jwtUtil;
    }


    @PostMapping("/save")
    public PredictionDto savePrediction(@RequestBody PredictionDto dto){

        return predictionService.save(dto);

    }

    @GetMapping("/username={username}")

    public List<PredictionDto> findByUsername(@PathVariable String username){

       return predictionService.findByUsername(username);


    }

    @GetMapping("/my")
    public ResponseEntity<?> findMyPredictions(@CookieValue(name = "jwt", required = false) String token) {
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("missing the token for authentication");
        }
        Long userId = jwtUtil.extractUserId(token);


        return ResponseEntity.ok().body(predictionService.findByUserId(userId));
    }






}

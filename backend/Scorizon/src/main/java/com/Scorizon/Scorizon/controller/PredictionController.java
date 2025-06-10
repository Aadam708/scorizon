package com.Scorizon.Scorizon.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Scorizon.Scorizon.dto.PredictionDto;
import com.Scorizon.Scorizon.service.PredictionService;

@RestController
@RequestMapping("api/predictions")
public class PredictionController {

    private PredictionService predictionService;


    public PredictionController(PredictionService predictionService) {
        this.predictionService = predictionService;
    }


    @PostMapping("/save")
    public PredictionDto savePrediction(@RequestBody PredictionDto dto){

        return predictionService.save(dto);

    }

    @GetMapping("/username={username}")

    public List<PredictionDto> findByUsername(@PathVariable String username){

       return predictionService.findByUsername(username);


    }

    @GetMapping("/userId={userId}")

    public List<PredictionDto> findByUsername(@PathVariable long userId){

       return predictionService.findByUserId(userId);


    }




}

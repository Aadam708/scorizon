package com.Scorizon.Scorizon.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class PredictionDto {

    private long predictionId;

    private long userId;

    private long matchId;

    private int predictedHomeScore;

    private int predictedAwayScore;

    private String predictedResult;

    private int pointsAwarded;
    
    private LocalDateTime createdAt;

}

package com.Scorizon.Scorizon.entity;

import java.time.LocalDateTime;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@Entity
@Table(name = "predictions")

public class Prediction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long prediction_id;

    private long user_id;
    private long match_id;
    private int predicted_home_score;
    private int predicted_away_score;
    private String predicted_result;
    private int points_awarded;
    private LocalDateTime created_at;

}

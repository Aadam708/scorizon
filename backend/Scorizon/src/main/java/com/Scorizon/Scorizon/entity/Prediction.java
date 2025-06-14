package com.Scorizon.Scorizon.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
    @Column(name="prediction_id")
    private long predictionId;

    @ManyToOne
    @JoinColumn(name="user_id", referencedColumnName="user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name="match_id", referencedColumnName = "match_id")
    private Match match;

    @Column(name = "predicted_home_score")
    private int predictedHomeScore;

    @Column(name = "predicted_away_score")
    private int predictedAwayScore;

    @Column(name = "predicted_result")
    private String predictedResult;

    @Column(name="points_awarded")
    private int pointsAwarded;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

}

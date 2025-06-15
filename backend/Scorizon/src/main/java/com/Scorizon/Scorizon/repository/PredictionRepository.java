package com.Scorizon.Scorizon.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Scorizon.Scorizon.entity.Prediction;
import java.util.List;
import java.time.LocalDateTime;



public interface PredictionRepository extends JpaRepository<Prediction,Long> {

    public List<Prediction> findByUser_Username(String username);
    public List<Prediction> findByUser_UserId(long userId);
    public List<Prediction> findByMatch_MatchId(long matchId);
    public List<Prediction> findByPointsAwarded(int pointsAwarded);
    public List<Prediction> findByMatch_HomeTeam(String homeTeam);
    public List<Prediction> findByMatch_AwayTeam(String awayTeam);
    public List<Prediction> findByCreatedAt(LocalDateTime createdAt);





}

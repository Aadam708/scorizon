package com.Scorizon.Scorizon.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.Scorizon.Scorizon.entity.Leaderboard;
import com.Scorizon.Scorizon.repository.LeaderboardRepository;

@Service
public class LeaderboardService {

    private LeaderboardRepository leaderboardRepository;

    public LeaderboardService(LeaderboardRepository leaderboardRepository) {
        this.leaderboardRepository = leaderboardRepository;
    }

    public List<Leaderboard> getLeaderboard(){

        return leaderboardRepository.findAll();
    }



}

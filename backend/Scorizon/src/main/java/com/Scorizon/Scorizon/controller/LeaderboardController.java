package com.Scorizon.Scorizon.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Scorizon.Scorizon.entity.Leaderboard;
import com.Scorizon.Scorizon.service.LeaderboardService;

@RestController
@RequestMapping("api/leaderboard")
public class LeaderboardController {


    private LeaderboardService leaderboardService;

    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }


    @GetMapping("/view")
    public List<Leaderboard> viewLeaderboard(){

        return leaderboardService.getLeaderboard();
    }


}

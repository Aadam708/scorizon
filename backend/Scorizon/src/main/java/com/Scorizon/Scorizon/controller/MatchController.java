package com.Scorizon.Scorizon.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Scorizon.Scorizon.entity.Match;
import com.Scorizon.Scorizon.service.MatchService;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    /*
        matches must be filtered by:
         -league
         -season
         -home team , away team
         -team
         -match status
         -league and season together


        Matches must be saved to the db by using the json data provided by the fotmob api
        Any existing matches in the db
        should be updated if values like score and status are different in the json from the fotmob api
    */

    @Autowired
    private MatchService matchService;

    //endpoint to find all matches by league name
    @GetMapping("/leagueName")
    public List<Match> findByLeague_Name(@RequestParam("name") String name){

        return matchService.findByLeague_Name(name);
    }

    //endpoint to find all matches filtered by season ie 2025 or 2024-2025 for the current 24/25 season
    @GetMapping("/season")
    public List<Match> findByLeague_Season(@RequestParam("season") String season){

        return matchService.findByLeague_Season(season);
    }

    //endpoint to find matches by their status so all upcoming matches or all finished matches
    @GetMapping("/matchStatus")
    public List<Match> findByMatchStatus(@RequestParam("matchStatus") String matchStatus){
        return matchService.findByMatchStatus(matchStatus);
    }

    //get all the matches with a specific club as the home team
    @GetMapping("/homeTeam")
    public List<Match> findByHomeTeam(@RequestParam("homeTeam") String homeTeam){
        return matchService.findByHomeTeam(homeTeam);
    }

    //get all the matches with a specific club as the away team
    @GetMapping("/awayTeam")
    public List<Match> findByAwayTeam(@RequestParam("awayTeam") String awayTeam){
        return matchService.findByAwayTeam(awayTeam);
    }

    //get all matches that involve a specific team e.g all liverpool matches
    @GetMapping("/team")
    public List<Match> findByTeam(@RequestParam("team") String team){
        List<Match> all = matchService.findByHomeTeam(team);
        List<Match> away = matchService.findByAwayTeam(team);

        all.addAll(away);
        return all;
    }

    //find matches by league and season
    @GetMapping
    public List<Match> findByLeagueAndSeason(
        @RequestParam(required=false) String league,
        @RequestParam(required=false) String season

    ){

        return matchService.findByLeagueAndSeason(league, season);
    }



}

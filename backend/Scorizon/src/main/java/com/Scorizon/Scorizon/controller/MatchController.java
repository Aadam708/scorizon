package com.Scorizon.Scorizon.controller;

import java.util.List;
import java.util.Objects;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Scorizon.Scorizon.dto.MatchDto;
import com.Scorizon.Scorizon.entity.League;
import com.Scorizon.Scorizon.entity.Match;
import com.Scorizon.Scorizon.service.LeagueService;
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

    private MatchService matchService;
    private  LeagueService leagueService;

    public MatchController(MatchService matchService, LeagueService leagueService) {
        this.matchService = matchService;
        this.leagueService = leagueService;
    }

    //endpoint to save a match

    @PostMapping("/save")
public Match saveMatch(@RequestBody MatchDto dto) {
    Match existing = matchService.findByApiId(dto.getApiId());
    League league = leagueService.findById(dto.getLeagueId())
        .orElseThrow(() -> new RuntimeException("League not found"));

    if (existing == null) {
        // New match
        Match match = new Match();
        match.setLeague(league);
        match.setHomeTeam(dto.getHomeTeam());
        match.setAwayTeam(dto.getAwayTeam());
        match.setMatchStatus(dto.getMatchStatus());
        match.setHomeScore(dto.getHomeScore());
        match.setAwayScore(dto.getAwayScore());
        match.setDatePlayed(dto.getDatePlayed());
        match.setApiId(dto.getApiId());
        match.setHomeId(dto.getHomeId());
        match.setAwayId(dto.getAwayId());
        return matchService.saveMatch(match);
    } else {
        // Update only changed fields
        boolean changed = false;
        if (!Objects.equals(existing.getHomeScore(), dto.getHomeScore())) {
            existing.setHomeScore(dto.getHomeScore());
            changed = true;
        }
        if (!Objects.equals(existing.getAwayScore(), dto.getAwayScore())) {
            existing.setAwayScore(dto.getAwayScore());
            changed = true;
        }
        if (!existing.getMatchStatus().equals(dto.getMatchStatus())) {
            existing.setMatchStatus(dto.getMatchStatus());
            changed = true;
        }


        if (changed) {
            return matchService.saveMatch(existing);
        }
        return existing;
    }
}



    //endpoint to find matches by their status so all upcoming matches or all finished matches
    @GetMapping("/status={status}")
    public List<Match> findByMatchStatus(@PathVariable String status){
        return matchService.findByMatchStatus(status);
    }

    //get all the matches with a specific club as the home team
    @GetMapping("/home={homeTeam}")
    public List<Match> findByHomeTeam(@PathVariable String homeTeam){
        return matchService.findByHomeTeam(homeTeam);
    }

    //get all the matches with a specific club as the away team
    @GetMapping("/away={awayTeam}")
    public List<Match> findByAwayTeam(@PathVariable String awayTeam){
        return matchService.findByAwayTeam(awayTeam);
    }

    //get all matches that involve a specific team e.g all liverpool matches
    @GetMapping("/team={team}")
    public List<Match> findByTeam(@PathVariable String team){
        List<Match> all = matchService.findByHomeTeam(team);
        List<Match> away = matchService.findByAwayTeam(team);

        all.addAll(away);
        return all;
    }

    //find match by Id

    @GetMapping("/{id}")
    public Match findById(@PathVariable long id){

        return matchService.findById(id);

    }

    //find matches by league and season or by league only
    @GetMapping
    public List<Match> findByLeagueAndSeason(
        @RequestParam(required=false) String league,
        @RequestParam(required=false) String season

    ){
        //if league is null then check if season is also null then throw error if both are
        if(league == null){

            //if season isnt null then just find matches by their season
            if(season!= null){
                return matchService.findByLeague_Season(season);
            }

            throw(new Error("League value must exist!"));
        }

        if(season == null){
            return matchService.findByLeague_Name(league);
        }



        return matchService.findByLeagueAndSeason(league, season);
    }



}

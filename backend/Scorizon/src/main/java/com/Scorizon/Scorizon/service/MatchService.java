package com.Scorizon.Scorizon.service;

import java.time.LocalDate;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Scorizon.Scorizon.repository.MatchRepository;
import com.Scorizon.Scorizon.entity.Match;

@Service
public class MatchService {

    @Autowired
    private MatchRepository matchRepository;

    public Match saveMatch(Match match){

        return matchRepository.save(match);
    }

    public List<Match> findByLeague_Name(String name){

        return matchRepository.findByLeague_Name(name);
    }

    public List<Match> findByLeague_Season(String season){

        return matchRepository.findByLeague_Season(season);
    }

    public List<Match> findByHomeTeam(String homeTeam){

        return matchRepository.findByHomeTeam(homeTeam);
    }

    public List<Match> findByAwayTeam(String awayTeam){
        return matchRepository.findByAwayTeam(awayTeam);
    }

    public List<Match> findByMatchStatus(String matchStatus){
        return matchRepository.findByMatchStatus(matchStatus);
    }

    public List<Match> findByDatePlayed(LocalDate datePlayed){
        return matchRepository.findByDatePlayed(datePlayed);
    }

    public List<Match> findByDatePlayedBetween(LocalDate start, LocalDate end){
        return matchRepository.findByDatePlayedBetween(start, end);
    }

    public Match findByApiId(long apiId){

        return matchRepository.findByApiId(apiId);
    }

    public List<Match> findByLeagueAndSeason(String league, String season){

        //only the matches in both the list of league and season filtered arrays will remain
        //so if league is Premier League and season is 2024-2025 only matches in both these arrays will be returned
        List<Match> filteredMatches = findByLeague_Name(league);
        filteredMatches.retainAll(findByLeague_Season(season));
        return filteredMatches;
    }

}

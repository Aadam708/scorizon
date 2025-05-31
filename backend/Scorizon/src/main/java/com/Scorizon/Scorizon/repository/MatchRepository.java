package com.Scorizon.Scorizon.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.Scorizon.Scorizon.entity.Match;



public interface MatchRepository extends JpaRepository<Match,Long> {

    public List<Match> findByLeague_Name(String name);

    public List<Match> findByLeague_Season(String season);

    public List<Match> findByHomeTeam(String homeTeam);

    public List<Match> findByAwayTeam(String awayTeam);

    public List<Match> findByMatchStatus(String matchStatus);

    public List<Match> findByDatePlayed(LocalDate datePlayed);

    public List<Match> findByDatePlayedBetween(LocalDate start, LocalDate end);

    public Match findByApiId(long apiId);

}

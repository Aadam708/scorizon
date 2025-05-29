package com.Scorizon.Scorizon.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
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
@Table(name = "matches")

public class Match {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private long match_id;

    @Column(name="league_id")
    @JsonProperty("league_id")
    private long leagueId;

    @Column(name="home_team")
    private String homeTeam;

    @Column(name="away_team")
    private String awayTeam;

    @Column(name="match_status")
    private String matchStatus;

    @Column(name="home_score")
    private int homeScore;

    @Column(name="away_score")
    private int awayScore;

    private boolean archived;

    @Column(name="is_knockout")
    private boolean isKnockout;

    @Column(name="date_played")
    private LocalDate datePlayed;

    @Column(name="api_id")
    private long apiId;

    @Column(name="home_id")
    private long homeId;

    @Column(name="away_id")
    private long awayId;


}

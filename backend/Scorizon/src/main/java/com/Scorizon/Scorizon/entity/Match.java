package com.Scorizon.Scorizon.entity;

import java.time.LocalDate;


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
@Table(name = "matches")

public class Match {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="match_id")
    private long matchId;


    @ManyToOne
    @JoinColumn(name="league_id", referencedColumnName="league_id")
    private League league;

    @Column(name="home_team")
    private String homeTeam;

    @Column(name="away_team")
    private String awayTeam;

    @Column(name="match_status")
    private String matchStatus;

    @Column(name="home_score")
    private Integer homeScore;

    @Column(name="away_score")
    private Integer awayScore;

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

package com.Scorizon.Scorizon.dto;

import java.time.LocalDate;


import lombok.Getter;

@Getter
public class MatchDto {

    private Long leagueId;
    private String homeTeam;
    private String awayTeam;
    private String matchStatus;
    private Integer homeScore;
    private Integer awayScore;
    private boolean archived;
    private boolean isKnockout;
    private LocalDate datePlayed;
    private Long apiId;
    private long homeId;
    private long awayId;
}

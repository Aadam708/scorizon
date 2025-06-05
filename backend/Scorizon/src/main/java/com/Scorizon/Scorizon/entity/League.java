package com.Scorizon.Scorizon.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity(name="leagues")

public class League {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "league_id")
    @JsonProperty("league_id")
    private long leagueId;

    private String name;

    @Column(name="api_id")
    @JsonProperty("api_id")
    private long apiId;

    private String season;

}

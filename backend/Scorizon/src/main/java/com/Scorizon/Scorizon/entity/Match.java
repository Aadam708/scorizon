package com.Scorizon.Scorizon.entity;

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
    private String league;
    private String home_team;
    private String away_team;
    private boolean isKnockout;
    private String match_status;
    private int home_score;
    private int away_score;
    private boolean archived;


}

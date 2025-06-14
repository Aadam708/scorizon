package com.Scorizon.Scorizon.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;


@Data
@Entity
@Table(name = "leaderboard")

public class Leaderboard {

    @Id
    @Column(name = "\"Username\"")
    private String username;

    @Column(name = "\"Total Points\"")
    private long totalPoints;


}

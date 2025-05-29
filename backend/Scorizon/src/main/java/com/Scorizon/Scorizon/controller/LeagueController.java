package com.Scorizon.Scorizon.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Scorizon.Scorizon.entity.League;
import com.Scorizon.Scorizon.service.LeagueService;

 @RestController
 @RequestMapping("api/leagues")

public class LeagueController {

    @Autowired
    private LeagueService leagueService;

    @GetMapping
    public List<League> getAllLeagues(){

        return leagueService.getAllLeagues();
    }

    @GetMapping("/{apiId}")

    public League getLeagueByApiId(@PathVariable("apiId") long apiId){

        return leagueService.findByApiId(apiId);
    }



}

package com.Scorizon.Scorizon.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Scorizon.Scorizon.entity.League;
import com.Scorizon.Scorizon.service.LeagueService;
import org.springframework.web.bind.annotation.RequestParam;


 @RestController
 @RequestMapping("api/leagues")

public class LeagueController {

    @Autowired
    private LeagueService leagueService;

    @GetMapping
    public List<League> getAllLeagues(@RequestParam(required = false) String name){

        //returning all leagues if no specific name is given
        if(name==null) return leagueService.getAllLeagues();

        //returning leagues with specified name
        return List.of(leagueService.findByName(name));

    }

    @GetMapping("/{apiId}")

    public League getLeagueByApiId(@PathVariable long apiId){

        return leagueService.findByApiId(apiId);
    }


}

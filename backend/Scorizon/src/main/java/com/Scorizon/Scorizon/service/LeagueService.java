package com.Scorizon.Scorizon.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Scorizon.Scorizon.entity.League;
import com.Scorizon.Scorizon.repository.LeagueRepository;

@Service
public class LeagueService {

    @Autowired
    private LeagueRepository leagueRepository;

    public League addLeague(League league){


        return leagueRepository.save(league);


    }

    public League findByApiId(long apiId){

        return leagueRepository.findByApiId(apiId);
    }

    public League findByName(String name){
        return leagueRepository.findByName(name);
    }

    public List<League> getAllLeagues(){

        return leagueRepository.findAll();
    }

}

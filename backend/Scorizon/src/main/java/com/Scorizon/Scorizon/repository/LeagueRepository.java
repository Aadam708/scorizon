package com.Scorizon.Scorizon.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.Scorizon.Scorizon.entity.League;

public interface LeagueRepository extends JpaRepository<League,Long>{

    League findByApiId(long apiId);
    League findByName(String name);

}

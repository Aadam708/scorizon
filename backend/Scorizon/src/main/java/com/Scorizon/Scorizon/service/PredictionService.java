package com.Scorizon.Scorizon.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Scorizon.Scorizon.dto.PredictionDto;
import com.Scorizon.Scorizon.entity.Match;
import com.Scorizon.Scorizon.entity.Prediction;
import com.Scorizon.Scorizon.entity.User;
import com.Scorizon.Scorizon.repository.MatchRepository;
import com.Scorizon.Scorizon.repository.PredictionRepository;
import com.Scorizon.Scorizon.repository.UserRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Service
public class PredictionService {

    private PredictionRepository predictionRepository;
    private UserRepository userRepository;
    private MatchRepository matchRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public PredictionService(PredictionRepository predictionRepository, UserRepository userRepository,
            MatchRepository matchRepository) {

        this.predictionRepository = predictionRepository;
        this.userRepository = userRepository;
        this.matchRepository = matchRepository;
    }


    //converting a prediction to a prediction dto using getters and setters
    public PredictionDto toDto(Prediction prediction){

        PredictionDto dto = new PredictionDto();

        dto.setPredictionId(prediction.getPredictionId());
        dto.setUserId(prediction.getUser().getUserId());
        dto.setMatchId(prediction.getMatch().getMatchId());
        dto.setPredictedHomeScore(prediction.getPredictedHomeScore());
        dto.setPredictedAwayScore(prediction.getPredictedAwayScore());
        dto.setPredictedResult(prediction.getPredictedResult());
        dto.setCreatedAt(prediction.getCreatedAt());

        return dto;
    }

    //polymorphism so that toDto works on lists of predictions too
    public List<PredictionDto> toDto(List<Prediction> predictions){

        List<PredictionDto> dtos = new ArrayList<>();

        for(int i =0; i<predictions.size();i++){

            Prediction prediction = predictions.get(i);
            dtos.add(toDto(prediction));

        }
        return dtos;

    }

    //conerting from dto to a prediction object
    public Prediction fromDto(PredictionDto dto){

        //making new prediction object
        Prediction prediction = new Prediction();

        //if no user is found runtime error will be thrown
        User user = userRepository.findById(dto.getUserId())
        .orElseThrow(() -> new RuntimeException("No user found with id: " + dto.getUserId()));

        //if no match is found a runtime error will be thrown
        Match match = matchRepository.findById(dto.getMatchId())
        .orElseThrow(() -> new RuntimeException("No Match Found with id: "+ dto.getMatchId()));


        //setting all manditory fields in prediction to the dto values and any values allowed
        //to be null will have their default values set when inserted into the db
        prediction.setUser(user);
        prediction.setMatch(match);
        prediction.setPredictedHomeScore(dto.getPredictedHomeScore());
        prediction.setPredictedAwayScore(dto.getPredictedAwayScore());
        prediction.setPredictedResult(dto.getPredictedResult());

        return prediction;

    }

    @Transactional
    //saving a prediction to the db
    public PredictionDto save(PredictionDto dto){

        Prediction prediction = fromDto(dto);
        Prediction saved = predictionRepository.save(prediction);

        //refreshes the db by finishing the calls
        predictionRepository.flush();

        entityManager.refresh(saved); // reloads DB-generated fields

        return toDto(saved);


    }

    public List<PredictionDto> findByUsername(String username){

        List<Prediction> predictions = predictionRepository.findByUser_Username(username);

        return toDto(predictions);
    }


    public List<PredictionDto> findByUserId(long userId){

        List<Prediction> predictions = predictionRepository.findByUser_UserId(userId);

        return toDto(predictions);
    }


    public void updatePointsAwarded(long matchId) {

        Match match = matchRepository.findById(matchId).orElseThrow(()-> new Error("No match exists with this id"));
        List<Prediction> predictions = predictionRepository.findByMatch_MatchId(matchId);

        for(Prediction p: predictions ){


            // 5 points for a correct score exactly

            if(match.getHomeScore() == p.getPredictedHomeScore()
                && match.getAwayScore() == p.getPredictedAwayScore()){

                    p.setPointsAwarded(5);
                }

            // 3 points for correct outcome of the result

            else if(match.getHomeScore() > match.getAwayScore()
            && p.getPredictedHomeScore() > p.getPredictedAwayScore() ){

                p.setPointsAwarded(3);

            }

            else if(match.getAwayScore() > match.getHomeScore()
            && p.getPredictedAwayScore() > p.getPredictedHomeScore()){

                p.setPointsAwarded(3);
            }

            else if(match.getAwayScore() == match.getHomeScore()
            && p.getPredictedAwayScore() == p.getPredictedHomeScore()){

                p.setPointsAwarded(3);
            }


            // 0 points for incorrect score and result
            else p.setPointsAwarded(0);;

            predictionRepository.save(p);
        }


    }





}

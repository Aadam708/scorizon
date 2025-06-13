"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import bg from '../../public/images/login_banner.png'
import logo from '../../public/images/logo.png'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type League = {
  name: string;
  season: string;
  league_id: number;
  api_id: number;
}

type Match = {
  matchId: number;
  league: League;
  homeTeam: string;
  awayTeam: string;
  matchStatus: string;
  homeScore: number | null;
  awayScore: number | null;
  datePlayed: string | Date;
  apiId: number;
  homeId: number;
  awayId: number;
};

type Prediction = {
  userId: number;
  matchId: number;
  predictedHomeScore: number;
  predictedAwayScore: number;
  predictedResult: string;
};

const Predict = () => {
  const router = useRouter();

  const [matches, setMatches] = useState<Match[]>([]);
  const [userPredictions, setUserPredictions] = useState<Prediction[]>([]);
  const [currentUser, setCurrentUser] = useState<{ user_id: number }>();
  // Keyed by matchId
  const [predictionInputs, setPredictionInputs] = useState<{
    [matchId: number]: { predictedHomeScore: number; predictedAwayScore: number }
  }>({});

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("http://localhost:8080/api/auth/me", { credentials: "include" });
      if (res.ok) {
        const user = await res.json();
        setCurrentUser({ user_id: user.user_id });
      } else{
        alert("session expired pls login again");
        router.push("/login");
      }
    }
    fetchUser();
  }, [router]);

  // Fetch user predictions
  useEffect(() => {
    const fetchUserPredictions = async () => {
      if (!currentUser) return;
      const res = await fetch(`http://localhost:8080/api/predictions/my`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });
      const data = await res.json();
      setUserPredictions(data);
    };
    fetchUserPredictions();
  }, [currentUser]);

  // Fetch matches
  useEffect(() => {
    const fetchMatches = async () => {
      const res = await fetch("http://localhost:8080/api/matches/status=upcoming", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });
      const data = await res.json();
      setMatches(data);
    };
    fetchMatches();
  }, []);

  // Filtering matches not yet predicted
  const predictedMatchIds = new Set(userPredictions.map(p => p.matchId));
  const matchesToPredict = matches.filter(m => !predictedMatchIds.has(m.matchId));

  // Save prediction for a match
  const savePrediction = async (
    matchId: number,
    predictedHomeScore: number,
    predictedAwayScore: number
  ) => {
    if (!currentUser) {
      alert("User not loaded");
      return;
    }
    if (
      predictedHomeScore === undefined ||
      predictedAwayScore === undefined ||
      isNaN(predictedHomeScore) ||
      isNaN(predictedAwayScore)
    ) {
      alert("Please enter both scores.");
      return;
    }

    // Optionally, you can calculate predictedResult here
    let predictedResult = "";
    if (predictedHomeScore > predictedAwayScore) predictedResult = "home";
    else if (predictedHomeScore < predictedAwayScore) predictedResult = "away";
    else predictedResult = "draw";

    const res = await fetch("http://localhost:8080/api/predictions/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        userId: currentUser.user_id,
        matchId,
        predictedHomeScore,
        predictedAwayScore,
        predictedResult,
      }),
    });

    if (res.ok) {
      alert("Prediction saved!");
      // Optionally refresh predictions
      setUserPredictions(prev => [
        ...prev,
        {
          userId: currentUser.user_id,
          matchId,
          predictedHomeScore,
          predictedAwayScore,
          predictedResult,
        }
      ]);
    } else {
      alert("Failed to save prediction.");
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-blue-50 to-cyan-300">
      {/* Logo */}
      <div className="">
        <Image
          src={logo}
          alt="Logo"
          className="absolute top-2 left-2 w-32 h-32"
        />
      </div>

      {/* Navbar */}
      <nav className="flex justify-end items-center p-8 text-gray-500 font-bold">
        <Link href="dashboard">Home</Link>
      </nav>

      <div className="flex flex-col items-center justify-center p-10 gap-8 ">
        {matchesToPredict.length === 0 ? (
          <div className="text-gray-700">No upcoming matches found.</div>
        ) : (
          matchesToPredict.map((match) => (
            <div
              key={match.apiId}
              className="bg-white rounded-2xl shadow-lg w-full max-w-xl p-6 flex flex-col md:flex-row items-center gap-6 border border-cyan-100 hover:shadow-2xl transition-all duration-200"
            >
              {/* Home Team */}
              <div className="flex flex-col items-center flex-1">
                <img
                  src={`https://images.fotmob.com/image_resources/logo/teamlogo/${match.homeId}_small.png`}
                  alt={match.homeTeam}
                  width={48}
                  height={48}
                  className="mb-2"
                />
                <span className="font-semibold text-lg">{match.homeTeam}</span>
              </div>
              {/* Prediction Inputs */}
              <div className="flex flex-col items-center flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="number"
                    min={0}
                    className="w-12 text-center border-b-2 border-cyan-400 focus:outline-none focus:border-blue-500 text-lg font-bold bg-cyan-50"
                    placeholder="0"
                    value={predictionInputs[match.matchId]?.predictedHomeScore ?? ""}
                    onChange={e =>
                      setPredictionInputs(inputs => ({
                        ...inputs,
                        [match.matchId]: {
                          ...inputs[match.matchId],
                          predictedHomeScore: Number(e.target.value),
                        },
                      }))
                    }
                  />
                  <span className="mx-2 text-2xl font-bold text-cyan-600">:</span>
                  <input
                    type="number"
                    min={0}
                    className="w-12 text-center border-b-2 border-cyan-400 focus:outline-none focus:border-blue-500 text-lg font-bold bg-cyan-50"
                    placeholder="0"
                    value={predictionInputs[match.matchId]?.predictedAwayScore ?? ""}
                    onChange={e =>
                      setPredictionInputs(inputs => ({
                        ...inputs,
                        [match.matchId]: {
                          ...inputs[match.matchId],
                          predictedAwayScore: Number(e.target.value),
                        },
                      }))
                    }
                  />
                </div>
                <button
                  className="mt-2 px-4 py-1 bg-cyan-500 text-white rounded-lg shadow hover:bg-cyan-600 transition"
                  onClick={() => {
                    const input = predictionInputs[match.matchId];
                    if (!input) {
                      alert("Please enter scores.");
                      return;
                    }
                    savePrediction(
                      match.matchId,
                      input.predictedHomeScore,
                      input.predictedAwayScore
                    );
                  }}
                >
                  Submit Prediction
                </button>
                <div className="flex flex-col items-center mt-2">
                  <img
                    src={`https://images.fotmob.com/image_resources/logo/leaguelogo/${match.league.api_id}.png`}
                    alt={match.league.name}
                    width={24}
                    height={24}
                  />
                  <span className="text-xs text-gray-500">{match.league.name}</span>
                  <span className="text-xs text-gray-400">{`${match.datePlayed}`}</span>
                </div>
              </div>
              {/* Away Team */}
              <div className="flex flex-col items-center flex-1">
                <img
                  src={`https://images.fotmob.com/image_resources/logo/teamlogo/${match.awayId}.png`}
                  alt={match.awayTeam}
                  width={48}
                  height={48}
                  className="mb-2"
                />
                <span className="font-semibold text-lg">{match.awayTeam}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Predict

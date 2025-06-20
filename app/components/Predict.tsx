"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Prediction = {
  matchId: number;
  predictedHomeScore: number;
  predictedAwayScore: number;
  predictedResult: string;
  pointsAwarded: number;
};

type Match = {
  matchId: number;
  league: { name: string; api_id: number };
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

const Predict = () => {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [userPredictions, setUserPredictions] = useState<Prediction[]>([]);
  const [currentUser, setCurrentUser] = useState<{ user_id: number }>();
  const [showPredictions, setShowPredictions] = useState(false);
  const [predictionInputs, setPredictionInputs] = useState<{
    [matchId: number]: { predictedHomeScore: number; predictedAwayScore: number };
  }>({});
  const [matchResults, setMatchResults] = useState<{ [matchId: number]: Match }>({});

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("http://localhost:8080/api/auth/me", { credentials: "include" });
      if (res.ok) {
        const user = await res.json();
        setCurrentUser({ user_id: user.user_id });
      } else {
        alert("session expired pls login again");
        router.push("/login");
      }
    };
    fetchUser();
  }, [router]);

  // Fetch user predictions
  useEffect(() => {
    const fetchUserPredictions = async () => {
      if (!currentUser) return;
      const res = await fetch(`http://localhost:8080/api/predictions/my`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
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
        credentials: "include",
      });
      const data = await res.json();
      setMatches(data);
    };
    fetchMatches();
  }, []);

  // Fetch actual match results for predictions
  useEffect(() => {
    const fetchAllMatchResults = async () => {
      const results: { [matchId: number]: Match } = {};
      for (const pred of userPredictions) {
        if (!matchResults[pred.matchId]) {
          const res = await fetch(`http://localhost:8080/api/matches/${pred.matchId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });
          if (res.ok) {
            const match = await res.json();
            results[pred.matchId] = match;
          }
        }
      }
      setMatchResults((prev) => ({ ...prev, ...results }));
    };
    if (userPredictions.length > 0) fetchAllMatchResults();
    // eslint-disable-next-line
  }, [userPredictions]);

  // Filtering matches not yet predicted
  const predictedMatchIds = new Set(userPredictions.map((p) => p.matchId));
  const matchesToPredict = matches.filter((m) => !predictedMatchIds.has(m.matchId));

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
      setUserPredictions((prev) => [
        ...prev,
        {
          userId: currentUser.user_id,
          matchId,
          predictedHomeScore,
          predictedAwayScore,
          predictedResult,
          pointsAwarded: 0,
        },
      ]);
    } else {
      alert("Failed to save prediction.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 to-cyan-300">
      {/* Slider Switch */}
      <div className="flex items-center justify-center mt-8 mb-6">
        <span className="mr-3 font-semibold text-cyan-700">Upcoming Games</span>
        <button
          type="button"
          className={`relative inline-flex items-center h-6 rounded-full w-12 transition-colors focus:outline-none ${
            showPredictions ? "bg-cyan-500" : "bg-gray-300"
          }`}
          onClick={() => setShowPredictions((prev) => !prev)}
          aria-pressed={showPredictions}
        >
          <span
            className={`inline-block w-6 h-6 transform bg-white rounded-full shadow transition-transform ${
              showPredictions ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
        <span className="ml-3 font-semibold text-cyan-700">My Predictions</span>
      </div>

      {/* Conditional Content */}
      {showPredictions ? (
        // Show previous predictions as cards
        <div className="flex flex-col gap-4 mb-8 w-full max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-cyan-700 mb-4">Your Previous Predictions</h2>
          {userPredictions.map((pred, idx) => {
            const match = matchResults[pred.matchId];
            const isCorrect =
              match &&
              match.homeScore != null &&
              match.awayScore != null &&
              ((pred.predictedHomeScore === match.homeScore &&
                pred.predictedAwayScore === match.awayScore) ||
                pred.pointsAwarded > 0);

            const isTBD = match?.homeScore == null || match?.awayScore == null;

            return (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-lg w-full p-6 flex flex-col md:flex-row items-center gap-6 border border-cyan-100 hover:shadow-2xl transition-all duration-200"
              >
                {/* Home Team */}
                <div className="flex flex-col items-center flex-1">
                  <img
                    src={`https://images.fotmob.com/image_resources/logo/teamlogo/${match?.homeId}_small.png`}
                    alt={match?.homeTeam}
                    width={48}
                    height={48}
                    className="mb-2"
                  />
                  <span className="font-semibold text-lg">{match?.homeTeam ?? "?"}</span>
                </div>
                {/* Prediction and Actual Result */}
                <div className="flex flex-col items-center flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-cyan-700 font-semibold">Your Prediction:</span>
                    <span className="font-bold">
                      {pred.predictedHomeScore} : {pred.predictedAwayScore}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-gray-700 font-semibold">Actual Result:</span>
                    <span className="font-bold">
                      {match?.homeScore ?? "?"} : {match?.awayScore ?? "?"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold ${
                        isTBD
                          ? "text-gray-500"
                          : isCorrect
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {isTBD ? "TBD" : isCorrect ? "Correct" : "Wrong"}
                    </span>
                    <span className="ml-2 text-cyan-700">
                      {isTBD
                        ? ""
                        : pred.pointsAwarded > 0
                        ? `+${pred.pointsAwarded} pts`
                        : "0 pts"}
                    </span>
                  </div>
                  <div className="flex flex-col items-center mt-2">
                    <img
                      src={`https://images.fotmob.com/image_resources/logo/leaguelogo/${match?.league.api_id}.png`}
                      alt={match?.league.name}
                      width={24}
                      height={24}
                    />
                    <span className="text-xs text-gray-500">{match?.league.name}</span>
                    <span className="text-xs text-gray-400">{`${match?.datePlayed}`}</span>
                  </div>
                </div>
                {/* Away Team */}
                <div className="flex flex-col items-center flex-1">
                  <img
                    src={`https://images.fotmob.com/image_resources/logo/teamlogo/${match?.awayId}_small.png`}
                    alt={match?.awayTeam}
                    width={48}
                    height={48}
                    className="mb-2"
                  />
                  <span className="font-semibold text-lg">{match?.awayTeam ?? "?"}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Show matches to predict as cards
        <div className="flex flex-col items-center justify-center p-10 gap-8 w-full">
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
                    src={`https://images.fotmob.com/image_resources/logo/teamlogo/${match.awayId}_small.png`}
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
      )}
    </div>
  );
};

export default Predict;

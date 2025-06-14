"use client"
import React, { useEffect, useState } from "react";

const Leaderboard = () => {

    type Leaderboard = {
        username:string,
        totalPoints:Number,
    }


    const[leaderboard, setLeaderboard] = useState<Leaderboard[]>([]);

    

    useEffect(() =>{

        const loadLeaderBoard = async () =>{

            const res = await fetch("http://localhost:8080/api/leaderboard/view",
                {
                    method:"GET",
                    headers:{"Content-Type": "application/json"},
                });

            try{

                const data = await res.json();
                setLeaderboard(data);
            } catch(e){
                console.error("unable to load leaderboard");
            }

        }

        loadLeaderBoard();

    },[])

     return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-300">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-cyan-700 mb-6 text-center">Leaderboard</h1>
        <div className="grid grid-cols-3 gap-4 font-semibold text-cyan-700 border-b pb-2">
          <div>Rank</div>
          <div>Username</div>
          <div>Points</div>
        </div>
        <div>
          {leaderboard.map((entry, idx) => (
            <div
              key={entry.username}
              className={`grid grid-cols-3 gap-4 py-2 items-center ${
                idx === 0 ? "bg-cyan-100 font-bold rounded-xl" : ""
              }`}
            >
              <div>{idx + 1}</div>
              <div>{entry.username}</div>
              <div>{entry.totalPoints.toString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;

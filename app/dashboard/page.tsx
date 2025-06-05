"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import bg from '../../public/images/login_banner.png'
import logo from '../../public/images/logo.png'
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Match = {
  league_id: number;
  home_team: string;
  away_team: string;
  match_status: string;
  home_score: number | null;
  away_score: number | null;
  date_played: string | Date;
  api_id: number;
  home_id: number;
  away_id: number;
  // add any other fields you expect
};
const Dashboard = () => {

  const[user, setUser] = useState<{username?:string, email?:string}>({});

  const router = useRouter();

  const handleFetchMatches = async () => {
    const res = await fetch("/api-scripts/run-fetch-matches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "FIFA Club World Cup" }), // Pass league name
    });
    const data = await res.json();
    console.log(data.result || data.error);
    if (!Array.isArray(data.result) || !data.result.every((m:Match) => m.league_id)) {
      alert("Error: Some matches are missing league_id!");
      return;
    }
    if(!data.error){
      saveMatches(data.result)

    }
  };

  const saveMatches = async (matches: Match[]) => {
  for (let i=0; i<2;i++) {
    // Convert string IDs to numbers
    let match = matches[i]
    console.log("Raw match object:", match);
    const fixedMatch = {
  leagueId: Number(match.league_id),
  homeTeam: match.home_team,
  awayTeam: match.away_team,
  matchStatus: match.match_status,
  homeScore: match.home_score,
  awayScore: match.away_score,
  datePlayed: match.date_played,
  apiId: Number(match.api_id),
  homeId: Number(match.home_id),
  awayId: Number(match.away_id),
  // add any other fields as needed, mapping camelCase:left to snake_case:right
};
    const res = await fetch("http://localhost:8080/api/matches/save", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(fixedMatch),
    });

    if (res.ok) {
      alert("saved matches to db successfully");
    } else {
      alert("error saving matches");
    }
  }
};

  useEffect(()=>{


    const fetchUser = async ()=>{

      const res = await fetch("http://localhost:8080/api/auth/me", { credentials: "include" })

      if(res.ok){

        const user = await res.json();
        setUser(user);
        return;
      }

      else if(res.status === 401){
        alert("session expired pls login again");
        router.push("/login")
        return;
      }

    }

    fetchUser();

  },[])


  return (
    <div className="min-h-screen">
    <div className="flex flex-col justify-center items-center">
      <Image
        src={bg}
        alt="Background Image"
        className="absolute inset-0 object-cover w-full h-full -z-10"
      />
    </div>
    <div className="">
      <Image
        src={logo}
        alt="Logo"
        className="absolute top-2 left-2 w-32 h-32"
      />
    </div>
    <div className="flex flex-row justify-end align-baseline m-8">
      <Link href="predict" className="text-white p-2 hover:text-cyan-300 transform transition-colors transition-duration-100"> Predict</Link>
      <Link href="leaderboard" className="text-white p-2 hover:text-cyan-300 tranfrom transition-colors transition-duration-100"> Leaderboard</Link>
      <Link href="settings" className="text-white p-2 hover:text-cyan-300 tranfrom transition-colors transition-duration-100"> Settings</Link>
       {/* ...Adding the option fetch matches for admin. */}
      {user.email === "a@a" && (
        <button
          onClick={handleFetchMatches}
          className=" text-white px-4 py-2 rounded hover:cursor-pointer hover:text-cyan-300 transition-colors transition-duration-100"
        >
          Update Matches
        </button>
      )}

    </div>

    <div className='text-white m-20 p-2 flex flex-row items-center align-middle justify-center'>

      <h1 className='text-5xl'>Hello, {user.username ? user.username : "Loading..."}!!</h1>
    </div>


  </div>

  )
}
export default Dashboard;

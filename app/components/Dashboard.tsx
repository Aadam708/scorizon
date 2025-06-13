"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import bg from '../../public/images/login_banner.png'
import logo from '../../public/images/logo.png'
import Link from 'next/link';
import { useRouter } from 'next/navigation';


//making all the types needed for saving a match and then retrieving details from the endpoint
type League ={
  name:string;
  season:string;
  league_id:number;
  api_id:number;
}
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
};

type MatchDto = {
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
const Dashboard = () => {

  const[user, setUser] = useState<{username?:string, email?:string}>({});
  const [navOpen, setNavOpen] = useState(false);
  const[matches, setMatches] = useState<MatchDto[]>([])

  const router = useRouter();
  //fetching matches from the api
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

  //fetching the 3 most upcoming games from my api endpoint

  const upcomingMatches = async ()=>{

    const res = await fetch("http://localhost:8080/api/matches/status=upcoming",{
      method:"GET",
      headers:{"Content-Type": "application/json"},
    })
    //try catch block so matches correctly returned
     try {
    const data = await res.json();
    // If your API returns { result: [...] }
    const matchArray = Array.isArray(data) ? data : data.result;
    console.log(matchArray);
    if (!Array.isArray(matchArray)) {
      console.error("API did not return an array");
      return [];
    }
    // Only take up to 3 matches
    return matchArray.slice(0, 3);
  } catch (err) {
    console.error(res.status, err);
    return [];
  }

  }

  //function to save matches

  const saveMatches = async (matches: Match[]) => {
  for (let i=0; i<4;i++) {
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

    //setting the matches returned from the api into a local array of length 3
    const displayUpcomingMatches = async()=>{

       const matches = await upcomingMatches();

       if(matches !== undefined){
          setMatches(matches);
       }
       else{
        console.error("Failed to load match data")
       };
    }





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

    const fetchAll = async ()=>{

      await fetchUser();
      await displayUpcomingMatches()
    }
    fetchAll();

  },[])

  useEffect(() => {
  console.log("Matches updated:", matches);
}, [matches]);

  const handleLogout = async () =>{

    await fetch("http://localhost:8080/api/auth/logout",{
      method:"POST",
      credentials:"include",
    });

    setUser({});
    //send back to main page
    router.push("/");
  }


  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div className="flex flex-col justify-center items-center">
        <Image
          src={bg}
          alt="Background Image"
          className="absolute inset-0 object-cover w-full h-full -z-10"
        />
      </div>
      {/* Logo */}
      <div className="">
        <Image
          src={logo}
          alt="Logo"
          className="absolute top-2 left-2 w-32 h-32"
        />
      </div>
      {/* Navbar */}
      <nav className="flex justify-end items-center m-8">
        {/* Hamburger for small screens */}
        <button
          className="lg:hidden text-white p-2"
          aria-label="Open navigation menu"
          onClick={() => setNavOpen(!navOpen)}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {/* Nav links */}
        <div className={`flex-col lg:flex-row lg:flex ${navOpen ? 'flex' : 'hidden'} absolute lg:static top-20 right-8 bg-gray-900 lg:bg-transparent rounded-lg lg:rounded-none z-20`}>
          <Link href="predict" className="text-white p-2 hover:text-cyan-300 transition-colors">Predict</Link>
          <Link href="leaderboard" className="text-white p-2 hover:text-cyan-300 transition-colors">Leaderboard</Link>
          <Link href="settings" className="text-white p-2 hover:text-cyan-300 transition-colors">Settings</Link>
          {user.email === "a@a" && (
            <button
              onClick={handleFetchMatches}
              className="text-white px-4 py-2 rounded hover:text-cyan-300 transition-colors"
            >
              Update Matches
            </button>
          )}
          <button
            onClick={handleLogout}
            className="text-white px-4 py-2 rounded hover:text-cyan-300 transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

    <div className='text-white m-20 p-2 flex flex-row items-center align-middle justify-center'>

      <h1 className='text-5xl'>Hello, {user.username ? user.username : "Loading..."}!!</h1>
    </div>


    {/* Displaying matches on dash to be predicted */}
<div className='flex flex-col items-center justify-center p-2 gap-5'>
  {matches.length === 0 ? (
    <div className="text-white">No upcoming matches found.</div>
  ) : (
    matches.map((match, idx) => (
      <div
        key={match.apiId}
        className="bg-white rounded-2xl h-24 w-60 md:w-96 lg:w-[600px] p-4 pt-6 flex justify-between items-center
    shadow hover:shadow-xl hover:scale-[1.03] hover:bg-gray-100 hover:border-cyan-400 border border-transparent
    transition-all duration-200 cursor-pointer"
      >
        <div className='flex-shrink-0'>
          <img
            src={`https://images.fotmob.com/image_resources/logo/teamlogo/${match.homeId}_small.png`}
            alt={match.homeTeam}
            width={40}
            height={40}
          />
        </div>
        <div className='flex flex-col items-center font-bold flex-1'>

          <Image
            src={`https://images.fotmob.com/image_resources/logo/leaguelogo/${match.league.api_id}.png`}
            alt={match.league.name}
            width={25}
            height={25}
            className='my-1'
          />

          <div className='text-2xl'>VS</div>


          <div className='text-sm '>{`${match.datePlayed}`}</div>

        </div>
        <div>
          <img
            src={`https://images.fotmob.com/image_resources/logo/teamlogo/${match.awayId}.png`}
            alt={match.awayTeam}
            width={40}
            height={40}
          />
        </div>
      </div>
    ))
  )}
</div>


  </div>

  )
}
export default Dashboard;

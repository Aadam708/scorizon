"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import bg from '../../public/images/login_banner.png'
import logo from '../../public/images/logo.png'
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Dashboard = () => {

  const[user, setUser] = useState<{username?:string}>({});

  const router = useRouter();

  useEffect(()=>{

    // const stored = localStorage.getItem('user');

    // if(stored){
    //   setUser(JSON.parse(stored));
    // }

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

    </div>

    <div className='text-white m-20 p-2 flex flex-row items-center align-middle justify-center'>

      <h1 className='text-5xl'>Hello, {user.username ? user.username : "Loading..."}!!</h1>
    </div>
    </div>
  )
}
export default Dashboard;

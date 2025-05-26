"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import login_banner from '../../public/images/login_banner.png'
import Link from 'next/link'
import useWindowSize from '@/hooks/useWindowSize'
import logo from '../../public/images/logo.png'
import  useRouter  from 'next/navigation'

const LoginPage = () => {

  //creating userouter

  const router = useRouter;

  //checking the screen size to determine how to render the page
  const {height,width} = useWindowSize();
  const isMobile = width<768;

  const [showPassword, setShowPassword] = useState(false)


  const [email,setEmail] = useState("")
  const[password,setPassword] = useState("");

  const handleLogin = async ()=>{

    const res = await fetch("http://localhost:8080/api/auth/login",{
      method:"POST",
      headers:{"Content-Type": "application/json"},

      body:JSON.stringify({
        email:email,
        password:password
      })
    });

    if(res.ok){

      alert("login success");
      router.redirect("register")
      return;
    }
    else{
      alert("invalid credentials");
    }

  }

  return (
    <div className={`${!isMobile && "grid grid-cols-2"} min-h-screen`}>
      {/* Left Side Image */}
      {!isMobile && (
        <div className="relative h-full">
          <Image
            src={login_banner}
            alt="login banner"
            fill
            className="w-full object-cover"
          />

          <div className="absolute top-8 left-8">
            <Image
              src={logo}
              alt="logo"
              width={300}
              height={300}
              className="w-40 h-40"
            />
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-5xl text-white">
            <p>
              Predict the
              <br />
              Game.
              <br />
              Win With <br />
              every score_
            </p>
          </div>
        </div>
      )}

      {/* Right Side Form */}
      <div className="flex flex-col items-center">
        <div className="mt-25 font-semibold text-3xl">Sign In to Scorizon</div>

        {/* Email */}
        <div className="mt-15 w-80">
          <div className="flex row items-center gap-0.5">
            <p className="text-sm text-gray-600">Email</p>{" "}
            <p className="text-red-400">*</p>
          </div>

          <input
            type="text"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-b border-gray-300 focus:outline-none focus:border-purple-500 transition duration-200 bg-transparent py-2"
          />
        </div>

        {/* Password */}
        <div className="mt-8 w-80 relative">
          <div className="flex row items-center gap-0.5">
            <p className="text-sm text-gray-600">Password</p>{" "}
            <p className="text-red-400">*</p>
          </div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-b border-gray-300 focus:outline-none focus:border-purple-500 transition duration-200 bg-transparent py-2 pr-16"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-8 text-sm text-blue-600 hover:underline"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Login Button */}
        <div className="mt-10">
          <button
            onClick={handleLogin}
            className="rounded-2xl bg-purple-800 p-3 pr-35 pl-35 text-white hover:bg-purple-500 transition-colors duration-300"
          >
            Login
          </button>
        </div>

        {/* OR Separator */}
        <div className="flex items-center justify-center w-80 mt-6">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-gray-500 text-sm">OR</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        {/* Google Login Button (Text-only version) */}
        <div className="mt-6 w-80">
          <button className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-gray-100 transition text-sm text-gray-700">
            <span className="text-lg">🌐</span>
            <span className="font-medium">Sign in with Google</span>
          </button>
        </div>

        {/*Dont have an account part */}

        <p className="mt-3 text-sm text-gray-500">
          Dont have an account?{" "}
          <Link href="register" className="underline underline-offset-3">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage

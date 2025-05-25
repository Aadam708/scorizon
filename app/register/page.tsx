"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import login_banner from '../../public/images/login_banner.png'
import Link from 'next/link'
import useWindowSize from '@/hooks/useWindowSize'
import logo from '../../public/images/logo.png'
import { redirect } from 'next/dist/server/api-utils'
import useRouter  from 'next/navigation'


interface PasswordInputProps{
    label:string,
    value:string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>void,
    showPassword:boolean,
    setShowPassword: (show:boolean) => void


    }

interface InputProps{
  contentType:string,
  label:string,
  onChange:(e:React.ChangeEvent<HTMLInputElement>) =>void,

}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  value,
  onChange,
  showPassword,
  setShowPassword,
}) => (
  <div className="mt-8 w-80 relative">
    <div className='flex row items-center gap-0.5'>
      <p className="text-sm text-gray-600">{label}</p> <p className='text-red-400'>*</p>
    </div>
    <input
      type={showPassword ? 'text' : 'password'}
      placeholder={label}
      value={value}
      onChange={onChange}
      className="w-full border-b border-gray-300 focus:outline-none focus:border-purple-500 transition duration-200 bg-transparent py-2 pr-16"
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-0 top-8 text-sm text-blue-600 hover:underline"
    >
      {showPassword ? 'Hide' : 'Show'}
    </button>
  </div>
)

const Input: React.FC<InputProps> =({
  contentType,
  label,
  onChange
}) =>(

  <div className="mt-8 w-80">
          <div className='flex row items-center gap-0.5'>
            <p className="text-sm text-gray-600">{label}</p> <p className='text-red-400'>*</p>
          </div>

          <input
            type={contentType}
            placeholder={label}
            onChange={onChange}

            className="w-full border-b border-gray-300 focus:outline-none focus:border-purple-500 transition duration-200 bg-transparent py-2"
          />
    </div>

)



const RegisterPage = () => {



  const {height,width} = useWindowSize();

  const isMobile = width<768;

  const router = useRouter;


  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const[password,setPassword] = useState("");
  const [retypePassword,setRetypePassword] = useState("");

  const [showPassword, setShowPassword] = useState(false)
  const [showRetypePassword, setShowRetypePassword] = useState(false)


  const handleRegister = async () =>{

    const random = Math.floor(Math.random() * 1000) + 1;

    if(password !== retypePassword){
      alert("passowrds dont match");
      return;
    }

    const res = await fetch("http://localhost:8080/api/auth/register", {
      method:"POST",
      headers:{"Content-Type" : "application/json"},
      body: JSON.stringify({

        first_name:firstName,
        last_name: lastName,
        email:email,
        username:firstName+random,
        password:password

      })

    })

    if (res.ok) {
      // Registration successful
      alert("Registration successful! Please log in.");
      router.redirect("login");
      // Optionally redirect to login page
    } else {
      // Handle error
      alert("Registration failed");
    }
  }

  return (
    <div className={`${!isMobile && "grid grid-cols-2"} min-h-screen`}>
      {/* Left Side Image */}
      {!isMobile && <div className='relative h-full'>
        <Image src={login_banner} alt="login banner" fill className="w-full object-cover" />


        <div className="absolute top-8 left-8">

          <Image src={logo} alt="logo" width={300} height={300} className="w-40 h-40" />

        </div>


        <div className='absolute inset-0 flex flex-col items-center justify-center text-5xl text-white'>

            <p>Predict the<br />Game.<br/>Win With <br />every score_</p>

        </div>

      </div>
      }

      {/* Right Side Form */}
      <div className="flex flex-col items-center">
        <div className="mt-1 font-semibold text-3xl ">
          Sign Up to Scorizon
        </div>


        {/* First Name*/}
        <Input
          contentType='text'
          label ="First Name"
          onChange={(e) => setFirstName(e.target.value)}
        />

        <Input
          contentType='text'
          label ="Last Name"
          onChange={e => setLastName(e.target.value)}
        />


        {/* Email */}
        <Input
          contentType='email'
          label ="Email"
          onChange={e => setEmail(e.target.value)}
        />



        {/* Password */}
        <PasswordInput
        label="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        />

        {/* Re-type Password */}
        <PasswordInput
        label="Re-type Password"
        value={retypePassword}
        onChange={e => setRetypePassword(e.target.value)}
        showPassword={showRetypePassword}
        setShowPassword={setShowRetypePassword}
        />


        {/* Sign Up Button */}
        <div className="mt-10">
          <button
            onClick={handleRegister}
            className="rounded-2xl bg-purple-800 p-3 pr-35 pl-35 text-white hover:bg-purple-500 transition-colors duration-300"
          >
            Sign Up
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
            <span className="font-medium">Sign Up with Google</span>
          </button>
        </div>

        {/*Dont have an account part */}

        <p className='mt-3 text-sm text-gray-500'>Already have an account? {' '}

          <Link href='login' className='underline'>Sign In</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage

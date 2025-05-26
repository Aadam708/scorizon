import React from 'react'
import Image from 'next/image';
import bg from '../../public/images/login_banner.png'
import logo from '../../public/images/logo.png'
import Link from 'next/link';

const Dashboard = () => {
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
      <Link href="predict" className="text-white p-2 hover:text-red-300 transform transition-colors transition-duration-100"> Predict</Link>
      <Link href="leaderboard" className="text-white p-2 hover:text-red-300 tranfrom transition-colors transition-duration-100"> Leaderboard</Link>
      <Link href="settings" className="text-white p-2 hover:text-red-300 tranfrom transition-colors transition-duration-100"> Settings</Link>

    </div>
    </div>
  )
}
export default Dashboard;

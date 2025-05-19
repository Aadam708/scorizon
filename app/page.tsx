import Image from "next/image";
import Link from "next/link";
import bg from "../public/images/bg.jpg";
import logo from "../public/images/logo.png";
import Display from "./components/HomeDisplayBlocks";
import "./globals.css";


export default function Home() {
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
      <Link href="login" className="text-white p-2 hover:text-red-300 transform transition-colors transition-duration-100"> Login</Link>
      <Link href="register" className="text-white p-2 hover:text-red-300 tranfrom transition-colors transition-duration-100"> Sign Up</Link>
    </div>

    <Display>

    </Display>

    <div className="flex flex-row justify-center items-center p-2">
      <Link href="register" className="border rounded-2xl bg-blue-400  border-white text-white p-2  hover:bg-blue-400 hover:border-blue-600 hover:opacity-60 transition-all transition-duration-200 transform"> Join The Community</Link>

    </div>
   </div>
  );
}

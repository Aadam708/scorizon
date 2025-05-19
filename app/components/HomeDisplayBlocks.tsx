"use client"
import React, { useState, useEffect } from 'react'
import anfield from '../../public/images/anfield.jpg'
import ucl from '../../public/images/ucl-stadium.jpg'
import wc from '../../public/images/world-cup.jpg'
import Image from 'next/image'
import useWindowSize from '@/hooks/useWindowSize'
import { ImageResponse } from 'next/server'

export default function HomeDisplayBlocks() {

  const {height,width} = useWindowSize();
  const isClient = width !== Number.MAX_SAFE_INTEGER;


  const isMobile = width<768;

  const[fade,setFade] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    { src: anfield, alt: "anfield stadium", text: "Predict" },
    { src: ucl, alt: "ucl stadium", text: "Compete" },
    { src: wc, alt: "world cup stadium", text: "Win" },
  ];

  useEffect(() => {
    if (isMobile) {
      // 2. Animate fade out, then change image, then fade in
      const fadeTimeout = setTimeout(() => setFade(false), 2500); // Start fade out before image changes
      const interval = setInterval(() => {
        setFade(false); // Start fade out
        setTimeout(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
          setFade(true); // Fade in new image
        },500); // 500ms fade duration
      }, 3000);
      return () => {
        clearInterval(interval);
        clearTimeout(fadeTimeout);
      };
    } else {
      // Desktop: just auto-advance as before
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [images.length, isMobile]);

  if(!isMobile){

  }

  return (
    <div className="flex flex-row justify-center items-center m-25 p-5 gap-5">
      {!isMobile ? (images.map((image, index) => (
        <div
          key={index}
          className={`relative group transition-all duration-1000 ${
            index === currentIndex ? "animate-glow" : ""
          }`}
        >
          <Image
            className={`border-[2px] h-55 w-40  opacity-80 ${
              index === currentIndex
                ? "opacity-100 border-blue-500 scale-105"
                : "group-hover:opacity-100 group-hover:border-blue-500"
            } transition-all duration-1000`}
            alt={image.alt}
            src={image.src}
          />
          <span
            className={`absolute inset-0 flex justify-center items-center text-white text-lg font-bold ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            } group-hover:opacity-100 transition-opacity duration-1000`}
          >
            {image.text}
          </span>
        </div> )))
        :(

          <div
            className="relative group animate-glow"
          >
            <Image
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              className={`border-[2px] h-55 w-40 border-blue-500 scale-105 transition-opacity duration-500
                ${fade ? "opacity-100" : "opacity-0"}`}
            />
            <span
              className={`absolute inset-0 flex justify-center items-center text-white text-lg font-bold transition-opacity duration-500
                ${fade ? "opacity-100" : "opacity-0"}`}
            >
              {images[currentIndex].text}
            </span>
          </div>
        )}

    </div>
  );
}

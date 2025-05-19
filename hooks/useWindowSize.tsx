"use client"
import {useState, useEffect} from 'react';


//this measures the window size starting with max size as default
export default function useWindowSize(){

    //interface for window size (height and width)
    interface WindowSize{
        height:number,
        width:number,
    }


    //use state for setting the default window size to max and also a set window size function
    const [windowSize,setWindowSize]= useState<WindowSize>( {
        height:Number.MAX_SAFE_INTEGER,
        width:Number.MAX_SAFE_INTEGER,
    })

    /*use effect to constantly measure window size and update the window height
     and width properties each time using set window size function
    */
    useEffect(() =>{

        function handleResize(){
            setWindowSize({
                height:window.innerHeight,
                width:window.innerWidth,

            })
        }

        if(typeof window !==undefined){

            window.addEventListener('resize',handleResize);

            handleResize();

            return () => window.removeEventListener('resize',handleResize);
        }
    },[])

    return windowSize;


}

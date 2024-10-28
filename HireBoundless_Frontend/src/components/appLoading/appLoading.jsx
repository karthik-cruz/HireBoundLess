import React from 'react'
import { IoLogoAmplify } from "react-icons/io5";


const AppLoading = () => {
    return (
        <div className='w-[100%] flex items-center justify-center h-[100vh]'>
            <div className='w-[20%] h-[20%]'>
                <div className='flex items-center gap-2'>
                    <IoLogoAmplify size={45} className='text-[#1dd1a1]' />
                    <p className="mb-0 font-extrabold text-[30px]">HireBoundless</p>
                </div>

                <div className='relative w-full rounded-[50px] h-[4px] bg-gray-200 mt-4 overflow-hidden'>
                    <div className='absolute h-full w-[20%] bg-[#1dd1a1] animate-loading-bar'></div>
                </div>
            </div>
        </div>
    )
}

export default AppLoading

import React from 'react'
import { FaGithub } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";


const Footer = () => {
    return (
        <div className='w-[100%] bg-[#1dd1a1] gap-4 py-4 flex flex-col items-center justify-center'>
            {/* copyright symbol and reserved text */}
            <p className="text-[20px] font-bold text-gray-800">© HireBoundless by Karthik S</p>


            {/* social media icons */}
            <div className="flex gap-4">
                <FaGithub className="hover:text-white cursor-pointer" size={25} />
                <FaInstagram className="hover:text-white cursor-pointer" size={25} />
                <FaFacebook className="hover:text-white cursor-pointer" size={25} />
                <FaSquareXTwitter className="hover:text-white cursor-pointer" size={25} />
            </div>

        </div>
    )
}

export default Footer

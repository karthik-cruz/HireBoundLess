import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

const NavTabs = () => {

    const location = useLocation();
    const navigate = useNavigate();



    return (
        <div className='flex  gap-10 items-center'>
            <p onClick={() => navigate('/jobs')} className={`${location.pathname === '/jobs' ? ' !border-[#1dd1a1] hover:border-[#1dd1a1]' : 'hover:border-gray-300'} mb-0 border-white border-b-4 text-[20px] font-bold py-2 cursor-pointer`}>Jobs</p>

            <p onClick={() => navigate('/companies')} className={`${location.pathname === '/companies' ? ' !border-[#1dd1a1] hover:border-[#1dd1a1]' : 'hover:border-gray-300'} mb-0 border-white border-b-4 text-[20px] py-2 font-bold cursor-pointer`}>Companies</p>

        </div>
    )
}

export default NavTabs

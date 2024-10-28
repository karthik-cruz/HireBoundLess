import React from 'react'
import noDataFound from "../../assets/images/noDataFound.png"
const NoDataFound = () => {
    return (
        <div className='flex items-center w-[200px]  justify-center flex-col'>
            <img className='w-full h-full' src={noDataFound} alt="no-data" />
            <p className='mb-0 font-bold'>No Data Found</p>
        </div>
    )
}

export default NoDataFound

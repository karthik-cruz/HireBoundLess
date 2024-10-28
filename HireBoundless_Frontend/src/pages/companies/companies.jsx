import React, { useState, useEffect } from 'react';
import EmptyBuildingIcon from '../../assets/icons/building.jpg';
import { Link } from 'react-router-dom';
import axios from 'axios';
import domain_URL from '../../config/config';
import { END_POINTS } from '../../api/urls';

const Companies = () => {
    const [companies, setCompanies] = useState([]);
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [industryFilter, setIndustryFilter] = useState("");

    useEffect(() => {
        const fetchCompany = async () => {
            const response = await axios.get(`${domain_URL}/${END_POINTS.getAllCompany}`);
            if (response.data.success) {
                setCompanies(response.data.companies);
                setFilteredCompanies(response.data.companies);  // Initialize filtered companies
            }
        };

        fetchCompany();
    }, [searchValue, locationFilter, industryFilter]);

    const handleSearch = (value) => {
        setSearchValue(value);
    };

    const handleLocationFilter = (value) => {
        setLocationFilter(value);
    };

    const handleIndustryFilter = (value) => {
        setIndustryFilter(value);
    };

    const handleSearchCompany = () => {
        const filtered = companies.filter(company =>
            company.name.toLowerCase().includes(searchValue.toLowerCase()) &&
            company.location?.city.toLowerCase().includes(locationFilter.toLowerCase()) &&
            company.industry.toLowerCase().includes(industryFilter.toLowerCase())
        );
        setFilteredCompanies(filtered);
    };

    return (
        <div className='w-[100%] h-[120vh]'>
            {/* Search bar and filter */}
            <div className='flex py-10 items-center justify-center border-b gap-2'>
                <input
                    onChange={(e) => handleSearch(e.target.value)}
                    className='border-2 w-[20%] duration-200 focus:border-blue-500 outline-none border-gray-200 p-2'
                    type="text"
                    placeholder='Search for a company... '
                />
                <button
                    onClick={handleSearchCompany}
                    className='border border-[#10ac84] rounded hover:bg-[#10ac84] duration-200 bg-[#1dd1a1] text-white py-2 px-4 font-medium '
                >
                    Search
                </button>
            </div>

            <div className='w-[100%] mt-10 flex'>
                {/* Filter section */}
                <div className='w-[30%] h-[350px] mx-auto flex flex-col p-4 gap-4 items-center shadow rounded border'>
                    <p className="mb-0 font-semibold text-gray-600 text-[22px] italic text-center">Filter Companies</p>
                    <div className='w-[90%] mx-auto mt-2'>
                        <label htmlFor="location" className='ms-1 text-gray-500'>Location</label>
                        <input
                            id='location'
                            type="text"
                            placeholder='Location'
                            className='border-2 w-[100%] mt-1 duration-200 focus:border-blue-500 outline-none border-gray-200 p-2'
                            onChange={(e) => handleLocationFilter(e.target.value)}
                        />
                    </div>
                    <div className='w-[90%] mx-auto mt-2'>
                        <label htmlFor="industry" className='ms-1 text-gray-500'>Industry</label>
                        <input
                            type="text"
                            id='industry'
                            placeholder='Eg. IT, Education, Banking...'
                            className='border-2 w-[100%] mt-1 duration-200 focus:border-blue-500 outline-none border-gray-200 p-2'
                            onChange={(e) => handleIndustryFilter(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleSearchCompany}
                        className='border border-[#10ac84] rounded hover:bg-[#10ac84] duration-200 bg-[#1dd1a1] mb-4 text-white py-2 px-8 font-medium '
                    >
                        Search
                    </button>
                </div>

                {/* Companies list */}
                <div className='w-[55%] flex flex-col gap-4 mx-auto'>
                    {filteredCompanies.length > 0 ? (
                        filteredCompanies.map((company, index) => (
                            <div key={index} className='w-full p-4 hover:shadow-xl duration-300 cursor-pointer rounded flex flex-col gap-4 border'>
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-start gap-2'>
                                        <div className='w-[60px] rounded border h-[60px]'>
                                            <img
                                                className='w-[100%] rounded h-[100%]'
                                                src={company?.recruiterId?.profile.avatar
                                                    ? `${domain_URL}/uploads/avatars/${company?.recruiterId?.profile.avatar}`
                                                    : EmptyBuildingIcon}
                                                alt="..."
                                            />
                                        </div>
                                        <p className="mb-0 font-semibold text-[22px] text-center">{company?.name}</p>
                                    </div>
                                    <div className='flex flex-col items-start'>
                                        <p className="mb-0 font-semibold text-blue-500 text-center">Link</p>
                                        <Link
                                            to={company?.link}
                                            target='_blank'
                                            className="mb-0 underline hover:text-blue-500 font-semibold text-gray-600 italic text-center"
                                        >
                                            {company?.link.slice(0, 20)}
                                        </Link>
                                    </div>
                                    <div>
                                        <p className="mb-0 font-semibold text-blue-500 text-center">Jobs</p>
                                        <p className="mb-0 font-semibold text-gray-600 italic text-center">{company?.jobs?.length}</p>
                                    </div>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-start flex-col'>
                                        <p className="mb-0 font-semibold text-center">Location</p>
                                        <p className="mb-0 font-semibold text-gray-500 text-[14px] capitalize text-center">
                                            {company?.location?.state}, {company?.location?.city}
                                        </p>
                                    </div>
                                    <div className='flex items-start flex-col'>
                                        <p className="mb-0 font-semibold text-center">Company Size</p>
                                        <p className="mb-0 font-semibold text-gray-500 capitalize text-[14px] text-center">
                                            {company?.size} Employees
                                        </p>
                                    </div>
                                    <div className='flex items-start flex-col'>
                                        <p className="mb-0 font-semibold text-center">Industry</p>
                                        <p className="mb-0 font-semibold text-gray-500 capitalize text-[14px] text-center">{company?.industry}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className='mb-0 font-bold'>No Companies Found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Companies;

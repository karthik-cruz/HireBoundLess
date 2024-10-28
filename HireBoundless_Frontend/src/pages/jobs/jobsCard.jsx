import React from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyBuildingIcon from "../../assets/icons/building.jpg";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import domain_URL from '../../config/config';
import { useSelector, useDispatch } from 'react-redux';
import NoDataFound from '../../components/noDataFound/noDataFound';

const JobsCard = (props) => {

    const userData = useSelector(state => state?.getUser?.user)
    const { jobs, activeJob, setActiveJob, loading } = props;

    const navigate = useNavigate();

    // Function to calculate time ago
    const getTimeAgo = (postedDate) => {
        const currentDate = new Date();
        const postDate = new Date(postedDate);

        // Calculate the difference in time (milliseconds)
        const timeDifference = currentDate - postDate;

        // Convert time difference from milliseconds to hours
        const hoursAgo = Math.floor(timeDifference / (1000 * 60 * 60));

        // Convert time difference from milliseconds to days
        const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

        if (daysAgo === 0) {
            if (hoursAgo === 0) {
                return "Just now"; // If it's less than 1 hour ago
            } else if (hoursAgo === 1) {
                return "1 hour ago"; // If it's exactly 1 hour ago
            } else {
                return `${hoursAgo} hours ago`; // Show hours ago
            }
        } else if (daysAgo === 1) {
            return "1 day ago"; // Show 1 day ago
        } else {
            return `${daysAgo} days ago`; // Show days ago
        }
    };

    const handleApplications = (job) => {
        localStorage.setItem("job", JSON.stringify(job))
        navigate("/applications")

    }


    return (
        <div className={` ${!jobs?.length ? "justify-center items-center" : ""} w-[35%] h-full p-4 overflow-y-auto border-2  rounded-[8px] flex flex-col gap-2 `}>
            {
                loading ? (
                    Array.from({ length: 10 }, (_, index) => (
                        <Skeleton key={index} width={"100%"} height={150} />
                    ))
                ) : (
                    jobs?.length > 0 ?
                        (
                            jobs?.map((job, index) => (
                                <div onClick={() => setActiveJob(index)} key={index} className={`border p-4 ${activeJob === index ? "border-[#1dd1a1] border-2" : ""} w-[100%] hover:bg-gray-100 rounded shadow cursor-pointer`}>
                                    <div className='flex mb-2 items-center justify-between '>
                                        <div className='flex items-center gap-4'>
                                            <img className='rounded h-[40px] w-[40px] border border-[#1dd1a1]'
                                                src={job?.postedBy?.profile?.avatar ? `${domain_URL}/uploads/avatars/${job?.postedBy?.profile?.avatar}` : EmptyBuildingIcon}
                                                alt="company_logo" title="company_logo" />
                                            <p className="mb-0 font-extrabold capitalize text-[16px]">{job?.company?.name}</p>
                                        </div>
                                        {userData?.role === "recruiter" &&
                                            <div onClick={() => handleApplications(job)} className='border  border-[#1dd1a1] px-2 py-1 rounded-[20px] select-none text-[12px] font-semibold hover:bg-emerald-500 hover:text-white bg-emerald-100'>Applications : {job?.applications?.length || 0}
                                            </div>
                                        }
                                    </div>
                                    <p className="mb-0 capitalize font-bold">{job?.title}</p>
                                    <p className="mb-0 font-medium text-[14px] capitalize">{job?.location}</p>
                                    <div className="flex items-center justify-between">
                                        <p className="mb-0 font-bold capitalize text-gray-700">
                                            {`${job?.salary}${job?.monthly ? "/ monthly" : "/ yearly"}`}
                                        </p>
                                        <p className="mb-0 font-bold text-gray-600 capitalize text-[12px]">
                                            {getTimeAgo(job?.postedDate)}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) :
                        <NoDataFound />
                )
            }
        </div>
    );
};

export default JobsCard;

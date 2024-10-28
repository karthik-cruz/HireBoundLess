import React, { useState, useEffect } from 'react'
import domain_URL from '../../config/config'
import EmptyBuildingIcon from '../../assets/icons/building.jpg'
import { useSelector, useDispatch } from 'react-redux'
import { fetchPostApplication } from '../../redux/slices/postApplicationSlice'
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import toast from 'react-hot-toast'
import axios from 'axios'
import { END_POINTS } from '../../api/urls'
import { useNavigate } from 'react-router-dom'
import NoDataFound from '../../components/noDataFound/noDataFound'

const JobDescription = (props) => {
    const { job, setIsOpen, setPopupFor, handlePostJob, jobsSubmitted, setJobsSubmitted } = props
    const userData = useSelector(state => state?.getUser?.user)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const [userApplication, setUserApplication] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUserApplication = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${domain_URL}/${END_POINTS.getApplication}/${job._id}/${userData._id}`);
                if (response.data.success) {
                    setUserApplication(response.data.application);
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.error("Error fetching user application:", error);
                toast.error("Failed to fetch application");
            } finally {
                setLoading(false);
            }
        };

        // Ensure job and userData are defined and user is a job seeker
        if (userData?.role === 'jobSeeker' && job?._id && userData?._id) {
            fetchUserApplication();
        }
    }, [job, userData]);

    const handleUpdateJob = () => {
        setPopupFor("Update Job")
        setIsOpen(true)
    }

    const handleDeleteJob = () => {
        setPopupFor("Delete Job")
        setIsOpen(true)
    }

    const handleApply = async () => {
        setLoading(true)

        if (userData?.profile?.resume) {

            await dispatch(fetchPostApplication({ jobId: job?._id, jobSeekerId: userData?._id, status: "applied" })).then((res) => {
                if (res?.payload?.success) {
                    setLoading(false)
                    setJobsSubmitted(!jobsSubmitted)
                    // setApplied(true) // Set applied state to true on successful application
                    toast.success(res?.payload?.message)
                } else {
                    toast.error(res?.payload?.message)
                    setLoading(false)
                }
            })
        } else {
            toast.error("Please upload your resume first")
            setTimeout(() => {
                navigate("/profile")
            }, 2000)
            setLoading(false)
        }
    }

    return (
        <div className={`w-[55%] p-10 h-full  overflow-y-auto border rounded ${!job ? "flex items-center justify-center" : ""}`}>
            {job ? (
                <>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                            <img className='rounded h-[60px] w-[60px] border border-[#1dd1a1]'
                                src={job?.postedBy?.profile?.avatar ? `${domain_URL}/uploads/avatars/${job?.postedBy?.profile?.avatar}` : EmptyBuildingIcon}
                                alt="company_logo" title="company_logo" />
                            <p className="mb-0 font-extrabold capitalize text-[25px]">{job?.company?.name}</p>
                        </div>

                        {/* Apply button and Edit button */}
                        {userData?.role === "jobSeeker" ? (
                            <div onClick={!userApplication ? handleApply : null} className={` ${userApplication ? "cursor-not-allowed bg-gray-400 " : "cursor-pointer  bg-[#1dd1a1] hover:bg-[#10a37f]"} text-white py-3 px-8 font-bold rounded-md `}>
                                {userApplication ? "Applied" : "Easy Apply"}
                            </div>
                        ) : userData?.role === "recruiter" && (
                            <div className='rounded-md border h-[50px] text-white w-[150px] flex items-center'>
                                <div onClick={handleUpdateJob} title='Edit Job' className='w-[50%] bg-gray-500 hover:bg-gray-600 rounded-s-md h-full cursor-pointer flex items-center justify-center'>
                                    <FaRegEdit size={20} />
                                </div>
                                <div onClick={handleDeleteJob} title='Delete job' className='w-[50%] flex items-center rounded-e-md bg-red-500 hover:bg-red-600 h-full cursor-pointer justify-center'>
                                    <MdDeleteForever size={23} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* title and location */}
                    <div className='mt-2'>
                        <p className='text-[25px] mb-0 font-bold capitalize'>{job?.title || '-'}</p>
                        <p className='text-[18px] capitalize'>{job?.location || '-'}</p>
                    </div>

                    {/* job details */}
                    <div className='mt-4'>
                        <p className='font-bold capitalize'>Role : {job?.title || '-'}</p>
                        <p className='font-bold capitalize'>Experience : {job?.experience || '-'}</p>
                        <p className='font-bold capitalize'>Salary : {`${job?.salary ? job?.salary : '-'} - ${job?.monthly ? "Monthly" : "Yearly"}`}</p>
                        <p className='font-bold capitalize'>Location : {job?.location || '-'}</p>
                    </div>

                    {/* Description */}
                    <div>
                        <p className='font-bold underline text-[18px] capitalize mt-4'>Description</p>
                        <p className='text-[14px] font-medium capitalize text-gray-700'>{job?.description || '-'}</p>
                    </div>

                    {/* Requirements and Skills */}
                    <div className='mt-4'>
                        <p className='font-bold underline text-[18px] capitalize mt-4'>Requirements and Skills</p>
                        <p className='text-[14px] font-medium capitalize text-gray-700'>{job?.skills || '-'}</p>
                    </div>

                    {/* Responsibilities */}
                    <div className='mt-4'>
                        <p className='font-bold underline text-[18px] capitalize mt-4'>Responsibilities</p>
                        <p className='text-[14px] font-medium capitalize text-gray-700'>{job?.responsibilities || '-'}</p>
                    </div>

                    <p className='text-gray-700 capitalize mt-4'>Job Type : {job?.jobType}</p>
                    <p className='text-gray-700 capitalize'>Qualification : {job?.qualification}</p>
                    <p className='text-gray-700 capitalize'>Pay Up To : {job?.salary} - {job?.salaryType}</p>
                    <p className='text-gray-700 capitalize mt-4'>Location : {job?.location}</p>
                    <p className='text-gray-700 capitalize mt-4'>Company Address : {job?.company?.location?.city} , {job?.company?.location?.state}</p>
                </>


            ) :
                <div className='flex items-center flex-col '>
                    <NoDataFound />
                    <p className='text-gray-700 font-bold mb-0'>Haven't posted any job yet ? <span onClick={() => handlePostJob()} className='text-[#1dd1a1] underline cursor-pointer'>Click here</span></p>
                </div>
            }



        </div>
    )
}

export default JobDescription

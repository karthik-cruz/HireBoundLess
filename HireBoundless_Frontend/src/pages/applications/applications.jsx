import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { END_POINTS } from '../../api/urls'
import domain_URL from '../../config/config'
import { useLocation } from 'react-router-dom'
import { fetchGetUser } from '../../redux/slices/getUserSlice'
import toast from 'react-hot-toast'
import { IoMdArrowRoundBack } from "react-icons/io";


const Index = () => {
    const [loading, setLoading] = useState(false)
    const userData = useSelector(state => state?.getUser?.user)
    const navigate = useNavigate()
    const [job, setJob] = useState(null)
    const [applicants, setApplicants] = useState([])
    const [submitted, setSubmitted] = useState(false)


    useEffect(() => {
        const fetchGetJobs = async () => {
            const jobs = localStorage.getItem("job")
            const parsedJob = JSON.parse(jobs)
            setJob(parsedJob)
        }

        if (userData?.role === "recruiter") {
            fetchGetJobs()
        } else {
            navigate("/jobs")
        }
    }, [])

    useEffect(() => {
        if (job && job.applications.length > 0) {
            // Reset applicants state to avoid duplicates
            setApplicants([]);

            // Fetch applicants
            job.applications.map(async (app) => {
                const { data } = await axios.get(`${domain_URL}/${END_POINTS.getAllApplicants}/${app}`);

                setApplicants((prevApplicants) => {
                    // Check if the applicant already exists in the state
                    const exists = prevApplicants.some(item => item._id === data?.application?._id);

                    if (!exists) {
                        return [...prevApplicants, data?.application];
                    } else {
                        return prevApplicants; // Avoid adding duplicates
                    }
                });
            });
        }
    }, [job, submitted]);

    const handleViewResume = (event, resume) => {
        event.preventDefault();
        if (resume) {
            const url = `${domain_URL}/uploads/resumes/${resume}`;

            // Create an anchor element
            const a = document.createElement('a');
            a.href = url;
            a.target = '_blank'; // Open in a new tab

            // Programmatically click the anchor to trigger the new tab opening
            a.click();
        } else {
            toast.error("No Resume Found");
        }
    };

    const handleStatusChange = async (e, id) => {
        try {
            const status = e.target.value;
            const response = await axios.put(`${domain_URL}/${END_POINTS.updateApplication}/${id}`, { status });
            if (response?.data?.success) {
                toast.success(response?.data?.message);
                setSubmitted(!submitted);
            } else {
                toast.error(response?.data?.message);
            }
        } catch (error) {
            console.error("Error updating application status:", error);
        }
    };

    console.log(applicants, "users")

    return (
        <div className='w-[90%]  mx-auto  my-4 border rounded-lg h-[90vh] '>
            <div onClick={() => navigate("/jobs")} className='mt-2 ms-6 w-fit text-[#1dd1a1] hover:text-[#10ac84] text-[20px] cursor-pointer flex items-center hover:underline'>
                <IoMdArrowRoundBack size={25} className='' />
                <span>Back</span>
            </div>
            <div className='h-[60px] shadow-md rounded-lg mx-3 flex items-center justify-center mt-4 bg-gray-200 text-[25px]  font-extrabold text-gray-800'>
                <h1 className=''>Applications ({job && job.applications.length})</h1>
            </div>




            {/* Job Details */}
            <div className='w-[100%] mt-4 flex items-start '>


                <div className='w-[35%] mx-auto border rounded-lg shadow-md'>
                    {job && (
                        <div className='w-[100%] p-4'>
                            <h1 className='text-[20px] text-center underline capitalize font-bold mb-2'>Job Details</h1>

                            <div className='flex items-center gap-2'>
                                <h1 className='text-[18px] font-bold '>Role : </h1>
                                <h1 className='text-[18px] text-gray-600 capitalize font-medium'> {job.title}</h1>
                            </div>
                            <div className='flex items-center gap-2'>
                                <h1 className='text-[18px] font-bold '>Experience : </h1>
                                <h1 className='text-[18px] text-gray-600 capitalize font-medium'> {job.experience}</h1>
                            </div>
                            <div className='flex items-center gap-2'>
                                <h1 className='text-[18px] font-bold '>Salary : </h1>
                                <h1 className='text-[18px] text-gray-600 capitalize font-medium'> {job.salary} / {job.monthly ? "Per Month" : "Per Year"}</h1>
                            </div>
                            <div className='flex items-center gap-2'>
                                <h1 className='text-[18px] font-bold '>Location : </h1>
                                <h1 className='text-[18px] text-gray-600 capitalize font-medium'> {job.location}</h1>
                            </div>

                        </div>)
                    }
                </div>

                <div className='w-[55%] mx-auto'>
                    {/* Applications List */}
                    <div className="relative border  overflow-x-auto shadow-md sm:rounded-lg h-[70vh]">
                        <table className=" w-full text-sm text-left rtl:text-right dark:text-gray-400">
                            <thead className="text-xs uppercase bg-gray-50 dark:text-gray-600 sticky top-0">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Email
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Action
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="overflow-y-auto">
                                {applicants && applicants?.length > 0 ? applicants?.map((user, i) => (
                                    <tr className="bg-white border-b">
                                        <th scope="row" className="px-6 capitalize py-4 font-medium whitespace-nowrap">
                                            {user.jobSeekerId?.name}
                                        </th>
                                        <td className="px-6 py-4">
                                            {user.jobSeekerId?.email}
                                        </td>
                                        <td onClick={(e) => handleViewResume(e, user?.jobSeekerId?.profile?.resume)} className="px-6 font-medium text-blue-600 cursor-pointer dark:text-blue-500 hover:underline py-4">
                                            View Resume
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                className={` hover:border-blue-400 border-2 font-medium cursor-pointer rounded-md px-2 py-1 capitalize ${user.status === 'applied' ? 'bg-blue-100 text-blue-600' :
                                                    user.status === 'interviewed' ? 'bg-yellow-100 text-yellow-600' :
                                                        user.status === 'hired' ? 'bg-green-100 text-green-600' :
                                                            user.status === 'rejected' ? 'bg-red-100 text-red-600' : ''
                                                    }`}
                                                value={user.status} // Dynamically set the select value
                                                onChange={(e) => handleStatusChange(e, user._id)} // Handle status change if needed
                                            >
                                                <option value="applied" className="bg-blue-100 font-medium text-blue-600">
                                                    Applied
                                                </option>
                                                <option value="interviewed" className="bg-yellow-100 font-medium text-yellow-600">
                                                    Interviewed
                                                </option>
                                                <option value="hired" className="bg-green-100 font-medium text-green-600">
                                                    Hired
                                                </option>
                                                <option value="rejected" className="bg-red-100 font-medium text-red-600">
                                                    Rejected
                                                </option>
                                            </select>
                                        </td>
                                    </tr>
                                )) : null}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>






        </div>
    )
}

export default Index

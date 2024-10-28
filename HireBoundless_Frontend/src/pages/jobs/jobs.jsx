import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import "./jobs.css"
import { IoIosSearch } from 'react-icons/io';
import { MdOutlineLocationOn } from 'react-icons/md';
import PopupModal from '../../components/popupModel/popupModel';
import toast from 'react-hot-toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Axios from 'axios';
//images--------------------------
import EmptyAvatar from "../../assets/icons/building.jpg"
//slices----------------------------
import { fetchGetUser } from '../../redux/slices/getUserSlice';
import { fetchPostJob } from '../../redux/slices/postJobSlice';
import { fetchGetJobs } from '../../redux/slices/getJobsSlice';
//components --------------------------
import JobsCard from '../../pages/jobs/jobsCard';
import JobDescription from '../../pages/jobs/jobDescription';
import domain_URL from '../../config/config';
import { END_POINTS } from '../../api/urls';

const Jobs = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [jobsSubmitted, setJobsSubmitted] = useState(false)
  const [activeJob, setActiveJob] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true)
  const [jobs, setJobs] = useState([])
  const [popupFor, setPopupFor] = useState(null)
  const userData = useSelector(state => state?.getUser?.user)
  const [searchValue, setSearchValue] = useState("")

  useEffect(() => {
    if (userData?.role === "recruiter") {
      setJobs([])
      dispatch(fetchGetJobs(userData?._id)).then((response) => {
        if (response?.payload?.success) {
          setJobs(response?.payload?.jobs)
        }
        setTimeout(() => {
          setLoading(false)
        }, 100)
      })
    } else if (userData?.role === "jobSeeker") {
      setJobs([])
      dispatch(fetchGetJobs()).then((response) => {
        if (response?.payload?.success) {
          setJobs(response?.payload?.jobs)
        }
        setTimeout(() => {
          setLoading(false)
        }, 100)
      })
    }
  }, [jobsSubmitted, userData, dispatch])


  // Create a shallow copy of jobs array and sort by postedDate in descending order
  const sortedJobs = jobs
    ?.filter((job) =>
      job.title.toLowerCase().includes(searchValue.toLowerCase())
    )
    .sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));

  const handlePostJob = () => {
    setPopupFor("Post New Job")
    if (userData?.profile?.company) {
      setIsOpen(true)
    } else {
      toast.error("Please complete your company profile")
      setTimeout(() => {
        navigate("/profile")
      }, 2000)
    }
  }


  const jobFormik = useFormik({
    initialValues: {
      title: popupFor === "Update Job" ? sortedJobs[activeJob]?.title : "",
      description: popupFor === "Update Job" ? sortedJobs[activeJob]?.description || "" : "",
      salary: popupFor === "Update Job" ? sortedJobs[activeJob]?.salary || "" : "",
      location: popupFor === "Update Job" ? sortedJobs[activeJob]?.location || "" : "",
      experience: popupFor === "Update Job" ? sortedJobs[activeJob]?.experience || "" : "",
      skills: popupFor === "Update Job" ? sortedJobs[activeJob]?.skills || "" : "",
      responsibilities: popupFor === "Update Job" ? sortedJobs[activeJob]?.responsibilities || "" : "",
      jobType: popupFor === "Update Job" ? sortedJobs[activeJob]?.jobType || "" : "",
      qualification: popupFor === "Update Job" ? sortedJobs[activeJob]?.qualification || "" : "",
      monthly: popupFor === "Update Job" ? sortedJobs[activeJob]?.monthly : false,
      postedBy: userData?._id || "",
      company: userData?.profile?.company || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
      salary: Yup.string().required("Salary is required"),
      location: Yup.string().required("Location is required"),
      experience: Yup.string().required("Experience is required"),
      skills: Yup.string().required("Skills are required"),
      jobType: Yup.string().required("Job type is required"),
      qualification: Yup.string().required("Qualification is required"),
      responsibilities: Yup.string().required("Responsibilities are required"),
    }),

    onSubmit: async (values) => {
      if (popupFor === "Post New Job") {
        dispatch(fetchPostJob(values)).then((res) => {
          if (res?.payload?.success) {
            setJobsSubmitted(!jobsSubmitted);
            toast.success(res?.payload?.message);
            jobFormik.resetForm();
            setIsOpen(false);
          } else {
            toast.error(res?.payload?.message);
          }
        });
      } else if (popupFor === "Update Job") {
        await Axios.put(`${domain_URL}/${END_POINTS.updateJob}/${sortedJobs[activeJob]?._id}`, values).then((response) => {
          if (response?.data?.success) {
            setJobsSubmitted(!jobsSubmitted)
            setIsOpen(false)
            toast.success(response?.data?.message)
          } else {
            toast.error(response?.data?.message)
          }
        })
      }
    },
  });



  const handleDeleteJob = async (job_id) => {
    await Axios.delete(`${domain_URL}/${END_POINTS.deleteJob}/${job_id}`).then((response) => {
      if (response?.data?.success) {
        setJobsSubmitted(!jobsSubmitted)
        setIsOpen(false)
        toast.success(response?.data?.message)
      } else {
        toast.error(response?.data?.message)
      }
    })
  }

  const handleSearch = (value) => {
    setSearchValue(value)

  }

  return (

    <div className='w-full '>
      {/* jobs page header  */}
      <div className={`w-full h-[70px] sticky top-0 bg-white flex items-center px-10 ${userData?.role === "recruiter" ? "justify-between" : "justify-center"} border shadow`}>

        {
          userData?.role === "recruiter" &&
          <div>
            <p className='mb-0 text-[18px] font-extrabold'>Posted Jobs ({sortedJobs?.length})</p>
          </div>
        }


        {/* search container ------------------------------------------ */}
        <div className='bg-gray-200 flex items-center w-[500px] rounded-[40px] px-3 h-[40px]'>
          <div className={`flex items-center gap-2  ${userData?.role === "jobSeeker" ? "border-e w-[70%]" : "w-[100%]"} border-gray-400`}>
            <IoIosSearch size={25} />
            <input type="text" onChange={(e) => handleSearch(e.target.value)}
              placeholder={userData?.role === "recruiter" ? "Search Posted Jobs" : "Search your perfect jobs"} className='outline-none h-[100%] w-[100%] bg-inherit ' />
          </div>
          {userData?.role === "jobSeeker" && <div className='flex gap-2 items-center'>
            <MdOutlineLocationOn size={25} />
            <input type="text" placeholder='Location' className=' w-[100%] h-[100%] outline-none bg-inherit ' />
          </div>}
        </div>


        {userData?.role === "recruiter" &&
          <div>
            <button onClick={() => handlePostJob()} className="bg-[#1dd1a1] py-2 px-4 rounded text-white font-semibold hover:bg-[#10ac84] shadow ">
              Post New Job
            </button>
          </div>
        }
      </div>

      <div className={`w-full  ${sortedJobs?.length ? "h-[100vh]" : "h-[80vh]"}  my-4 flex items-center justify-evenly`}>

        {/* Jobs listing container */}
        <JobsCard
          jobs={sortedJobs}
          activeJob={activeJob}
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          jobsSubmitted={jobsSubmitted}
          setJobsSubmitted={setJobsSubmitted}
          setActiveJob={setActiveJob}
          loading={loading}
          setLoading={setLoading} />


        {/* Jobs description container */}

        <JobDescription
          popupFor={popupFor}
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          handlePostJob={handlePostJob}
          setPopupFor={setPopupFor}
          loading={loading}
          jobsSubmitted={jobsSubmitted}
          setJobsSubmitted={setJobsSubmitted}
          setLoading={setLoading}
          job={sortedJobs[activeJob]}
        />
      </div>

      {/* popup models ------------------------------------------------------------------------- */}


      <PopupModal popupFor={popupFor} isOpen={popupFor === "Delete Job" ? false : isOpen} size={true} setIsOpen={setIsOpen} name={popupFor}>
        {popupFor === "Post New Job" || popupFor === "Update Job" ?
          <form className='h-[75vh] overflow-y-auto'>
            {/* Job Title */}
            <div className="my-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Job Title:
              </label>
              <input
                type="text"
                onChange={jobFormik.handleChange}
                value={jobFormik?.values?.title}
                id="title"
                name="title"
                placeholder="Job title"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description:
              </label>
              <textarea
                id="description"
                onChange={jobFormik.handleChange}
                value={jobFormik?.values?.description}
                name="description"
                maxLength={500}
                placeholder="Job description"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Experience */}
            <div className="mb-4">
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                Experience:
              </label>
              <input
                type="text"
                id="experience"
                onChange={jobFormik.handleChange}
                value={jobFormik?.values?.experience}
                name="experience"
                placeholder="Experience"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Requirements & Skills */}
            <div className="mb-4">
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
                Requirements and Skills:
              </label>
              <textarea
                type="text"
                id="skills"
                onChange={jobFormik.handleChange}
                value={jobFormik?.values?.skills}
                name="skills"
                placeholder="Requirements & Skills"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Responsibilities */}
            <div className="mb-4">
              <label htmlFor="Responsibilities" className="block text-sm font-medium text-gray-700 mb-2">
                Responsibilities:
              </label>
              <textarea
                type="text"
                id="Responsibilities"
                onChange={jobFormik.handleChange}
                value={jobFormik?.values?.responsibilities}
                name="responsibilities"
                placeholder="Responsibilities"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Job Location */}
            <div className="mb-4">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Job Location:
              </label>
              <input
                type="text"
                onChange={jobFormik.handleChange}
                value={jobFormik?.values?.location}
                id="location"
                name="location"
                placeholder="Location"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Salary and Salary Type */}
            <div className="mb-4">
              <div className="flex ">
                <div className='w-full '>
                  <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-2">
                    Salary:
                  </label>
                  <div className='flex w-full gap-2 items-center'>
                    <input
                      type="text"
                      onChange={jobFormik.handleChange}
                      value={jobFormik?.values?.salary}
                      id="salary"
                      name="salary"
                      placeholder="Salary"
                      className="p-3 border w-[80%] border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        name="monthly" value={jobFormik?.values?.monthly}
                        onChange={jobFormik.handleChange}
                        checked={jobFormik?.values?.monthly}
                        type="checkbox" id="year" className='cursor pointer' />
                      <label htmlFor="year" className="text-[18px] cursor-pointer font-bold text-gray-700">
                        Monthly
                      </label>
                    </div>
                  </div>
                </div>


              </div>
            </div>

            {/* Job Type */}
            <div className="mb-4">
              <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-2">
                Job Type:
              </label>
              <input
                type="text"
                id="jobType"
                onChange={jobFormik.handleChange}
                value={jobFormik?.values?.jobType}
                name="jobType"
                placeholder="Job Type"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Qualification */}
            <div className="mb-4">
              <label htmlFor="qualification" className="block text-sm font-medium text-gray-700 mb-2">
                Qualification:
              </label>
              <input
                type="text"
                onChange={jobFormik.handleChange}
                value={jobFormik?.values?.qualification}
                id="qualification"
                name="qualification"
                placeholder="Qualification"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit Button */}
            <div className='flex items-center sticky bottom-0 bg-white rounded p-4 shadow justify-center gap-10'>

              <button onClick={() => setIsOpen(false)} className=" font-bold text-[18px] w-[20%] bg-gray-600 text-white p-3 rounded-lg shadow-md hover:bg-gray-700 transition  duration-300">
                Cancel
              </button>

              <button
                // type="submit"
                onClick={jobFormik.handleSubmit}
                className=" bg-[#1dd1a1] font-bold text-[18px]  w-[30%] text-white p-3 rounded-lg shadow-md hover:bg-[#10ac84] transition duration-300"
              >
                Submit
              </button>
            </div>
          </form> : null
        }
      </PopupModal>
      {
        popupFor === "Delete Job" && isOpen ?
          <div id="popup-modal" tabindex="-1" className={`${isOpen ? "flex" : "hidden"} overflow-y-auto bg-black bg-opacity-25 overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-full md:inset-0`}>
            <div className="relative p-4 w-full max-w-md max-h-full">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <button onClick={() => setIsOpen(false)} type="button" className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal">
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
                <div className="p-4 md:p-5 text-center">
                  <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this job?</h3>
                  <button onClick={() => handleDeleteJob(sortedJobs[activeJob]?._id)} className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                    Yes, I'm sure
                  </button>
                  <button onClick={() => setIsOpen(false)} className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">No, cancel</button>
                </div>
              </div>
            </div>
          </div>
          : null
      }


    </div >
  );
};

export default Jobs;

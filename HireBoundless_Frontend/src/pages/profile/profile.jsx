import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import EmptyAvatar from "./../../assets/images/EmptyAvatar.png"
import { useFormik } from 'formik'
import * as Yup from 'yup'
import PopupModel from '../../components/popupModel/popupModel'
import { fetchGetUser } from '../../redux/slices/getUserSlice'
// import { fetchUpdateProfile } from '../../redux/slices/updateProfileSlice'
import { toast } from 'react-hot-toast';
import { fetchCompanyCreate } from '../../redux/slices/companyCreateSlice'
import { fetchCompany } from '../../redux/slices/getCompanySlice'
import { fetchUpdateCompany } from '../../redux/slices/updateCompanySlice'
// import { IoIosSearch } from 'react-icons/io';
// import { FaUserCircle } from 'react-icons/fa';
import { IoEyeOffOutline } from "react-icons/io5";
import { updatePassword } from '../../api/update'
import { IoEyeOutline } from "react-icons/io5";
import axios from 'axios'
import domain_URL from '../../config/config'
import { END_POINTS } from '../../api/urls'

const Profile = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [popupFor, setPopupFor] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [submittedProfile, setSubmittedProfile] = useState(false)
  const userData = useSelector(state => state?.getUser?.user)
  const [showPasswordFor, setShowPasswordFor] = useState("")
  const userCompany = useSelector(state => state?.getCompany?.company)

  // references for input file types -----------------------------
  const resumeRef = useRef(null)
  const resumeUpdateRef = useRef(null)
  const avatarRef = useRef(null)
  const iconRef = useRef(null)

  //formik for add company details-----------------------------
  const formik = useFormik({
    initialValues: {
      name: popupFor === "Add Company" ? "" : userCompany?.name,
      industry: popupFor === "Add Company" ? "" : userCompany?.industry,
      city: popupFor === "Add Company" ? "" : userCompany?.location?.city,
      state: popupFor === "Add Company" ? "" : userCompany?.location?.state,
      size: popupFor === "Add Company" ? "" : userCompany?.size,
      link: popupFor === "Add Company" ? "" : userCompany?.link,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Company name is Required'),

      industry: Yup.string()
        .required('industry is Required'),

      city: Yup.string()
        .required('city is Required'),

      state: Yup.string()
        .required('state is Required'),

      size: Yup.string()
        .required('size is Required'),

      link: Yup.string()
        .required('link is Required'),
    }),

    onSubmit: (values) => {
      setLoading(true)
      if (popupFor === "Add Company") {
        dispatch(fetchCompanyCreate({
          name: values.name,
          industry: values.industry,
          city: values.city,
          state: values.state,
          size: values.size,
          link: values.link,
          recruiterId: userData?._id
        })).then((response) => {
          if (response?.payload?.success) {
            toast.success(response?.payload?.message)
            setIsOpen(false)
            setLoading(false)
            setSubmitted(!submitted)
            setSubmittedProfile(!submittedProfile)
            formik.resetForm()
          } else {
            toast.error(response?.payload?.message)
            setLoading(false)
          }
        }
        )
      } else if (popupFor === "Update Company") {
        dispatch(fetchUpdateCompany({
          data: {
            name: values.name,
            industry: values.industry,
            city: values.city,
            state: values.state,
            size: values.size,
            link: values.link,
            recruiterId: userData?._id
          }, params: userCompany?._id
        }
        )).then((response) => {
          if (response?.payload?.success) {
            toast.success(response?.payload?.message)
            setLoading(false)
            setIsOpen(false)
            setSubmitted(!submitted)
            formik.resetForm()
          } else {
            toast.error(response?.payload?.message)
            setLoading(false)
          }
        }
        )
      }
    }
  })

  const formikPassword = useFormik({
    initialValues: {
      password: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    // enableReinitialize: true,
    validationSchema: Yup.object({
      password: Yup.string()
        .required('Old Password is Required'),
      newPassword: Yup.string()
        .required('New Password is Required'),
      confirmNewPassword: Yup.string()
        .required('Confirm Password is Required')
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
    }),
    onSubmit: async (values) => {
      setLoading(true)
      await updatePassword(userData?._id, { password: values.password, newPassword: values.newPassword }).then((response) => {
        if (response?.success) {
          toast.success(response?.message)
          setLoading(false)
          setIsOpen(false)
          setSubmittedProfile(!submittedProfile)
          formikPassword.resetForm()
        } else {
          toast.error(response?.message)
          setLoading(false)
        }
      })
    }
  })



  const formikProfile = useFormik({
    initialValues: {
      username: userData?.name || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      username: Yup.string()
        .required('Name is Required'),
    }),
    onSubmit: async (values) => {
      setLoading(true)
      await axios.put(`${domain_URL}/${END_POINTS.profileUpdate}/${userData?._id}`, values).then((response) => {
        if (response?.data?.success) {
          toast.success(response?.data?.message)
          setLoading(false)
          setIsOpen(false)
          setSubmittedProfile(!submittedProfile)
          formikProfile.resetForm()
        } else {
          toast.error(response?.data?.message)
          setLoading(false)
        }
      })

    }
  })


  //useEffect for fetch the companies and users data initially ----------------------
  useEffect(() => {
    if (userData?._id) {
      dispatch(fetchCompany(userData?._id)).then((response) => {
        if (response?.payload?.success) {
        }
      })
    }
  }, [submitted])



  useEffect(() => {
    if (userData?._id) {
      dispatch(fetchGetUser(userData?._id)).then((response) => {
        if (response?.payload?.success) {
        }
      })
    }
  }, [submittedProfile])


  useEffect(() => {
    formik.resetForm()
    formikProfile.resetForm()
    formikPassword.resetForm()
  }, [isOpen])


  const handleCreateCompany = () => {
    setPopupFor("Add Company")
    setIsOpen(true)
  }

  const handleUpdateProfile = () => {
    setPopupFor("Update Profile")
    setIsOpen(true)
  }

  const handleUpdatePassword = () => {
    setPopupFor("Update Password")
    setIsOpen(true)
  }
  const handleUpdateCompany = () => {
    setPopupFor("Update Company")
    setIsOpen(true)
  }

  const handleSubmit = () => {
    if (popupFor === "Add Company" || popupFor === "Update Company") {
      formik.handleSubmit()
    }
    if (popupFor === "Update Profile") {
      formikProfile.handleSubmit()
    }
    if (popupFor === "Update Password") {
      formikPassword.handleSubmit()
    }
  }

  const handleCancel = () => {
    setIsOpen(false)
  }

  const handleClick = () => {
    if (resumeRef.current) {
      resumeRef.current.click(); // Trigger file input click
    } else {
    }
  };

  const handleResumeUpload = async (e) => {
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("resume", file);

      const response = await axios.put(`${domain_URL}/${END_POINTS.profileCreate}/${userData?._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Ensure correct headers for file upload
        }
      });
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        setSubmittedProfile(!submittedProfile);
      } else {
        toast.error(response?.data?.message || "An error occurred while uploading the resume.");
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast.error("An error occurred while uploading the resume.");
    }
  };

  const handleAvatarUpload = async (e) => {
    try {
      const file = e.target.files[0];

      // Check if a file was selected
      if (!file) {
        return; // Exit early if no file is selected
      }

      const formData = new FormData();
      formData.append("avatar", file);

      const response = await axios.put(`${domain_URL}/${END_POINTS.updateAvatar}/${userData?._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Ensure correct headers for file upload
        }
      });
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        setSubmittedProfile(!submittedProfile);
      } else {
        toast.error(response?.data?.message || "An error occurred while uploading the image.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("An error occurred while uploading the image.");
    }
  };


  return (

    <div className='w-full py-5'>

      {/* profile image container -------------------------------------------------- */}
      <div className='border bg-white  mx-auto  w-[80%] p-10  shadow items-center  gap-10 rounded flex'>
        <div className='rounded-full flex items-center justify-center cursor-pointer w-[300px] h-[300px] border-2 border-gray-200 shadow p-1 '>
          {userData?.profile?.avatar ?

            <img className='rounded-full w-full h-full object-cover'
              src={`${domain_URL}/uploads/avatars/${userData?.profile?.avatar}`}
              alt="..." title="profile_image" /> :

            <img className='rounded-full w-full h-full object-cover'
              src={EmptyAvatar}
              alt="..." title="profile_image" />

          }

        </div>

        <div onClick={() => avatarRef.current.click()} className='px-8 py-5 shadow text-[#1dd1a1] rounded-xl cursor-pointer text-[18px] font-bold border-2 bg-gray-100 hover:bg-gray-200  '>
          Edit Profile Picture
          <input
            type="file"
            ref={avatarRef}
            onChange={(e) => handleAvatarUpload(e)}
            className=" hidden "
            accept=".png, .jpg, .jpeg"
          />
        </div>
      </div>

      {/* profile container ----------------------------------------------------------- */}
      <div className='border mx-auto my-5 w-[80%] p-10 flex flex-col shadow items-center  gap-10 rounded '>

        <p className="w-full text-[20px] font-extrabold">Profile Details</p>

        <table className="w-full shadow rounded border-2 text-[16px] text-left rtl:text-right text-gray-500 dark:text-gray-400">

          <tbody>
            <tr className="bg-white border-b  ">
              <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
                Name :
              </th>
              <td className="px-6 font-medium py-4">
                {userData?.name}
              </td>

              <td className="px-6 py-4 text-[18px] text-right">
                <p title='Edit-Name' onClick={() => handleUpdateProfile()} className="font-bold cursor-pointer text-[#1dd1a1] hover:underline">Edit</p>
              </td>
            </tr>
            <tr className="bg-white border-b ">
              <th scope="row" className="px-6 py-4 font-medium  whitespace-nowrap ">
                Email :
              </th>
              <td className="px-6 font-medium py-4">
                {userData?.email}
              </td>


            </tr>
            <tr className="bg-white border-b  ">
              <th scope="row" className="px-6 py-4 font-medium  whitespace-nowrap ">
                Password :
              </th>
              <td className="px-6 font-medium py-4">
                ****************
              </td>

              <td className="px-6 py-4 text-[18px] text-right">
                <p title='Edit-Password' onClick={() => handleUpdatePassword()} className="font-bold cursor-pointer text-[#1dd1a1] hover:underline">Edit</p>
              </td>

            </tr>

            {userData?.role === "jobSeeker" && userData?.profile?.resume && <tr className="bg-white   ">
              <th scope="row" className="px-6 py-4 font-medium  whitespace-nowrap ">
                Resume :
              </th>
              <td className="px-6 font-medium py-4">
                {userData?.profile?.resume}
              </td>

              <td className="px-6 py-4 text-[18px] text-right">
                <p title='Edit-Resume' onClick={() => resumeUpdateRef.current.click()} className="font-bold cursor-pointer text-[#1dd1a1] hover:underline">Edit</p>
                <input
                  type="file"
                  ref={resumeUpdateRef}
                  onChange={(e) => handleResumeUpload(e)}
                  className=" hidden "
                  accept=".pdf,.doc,.docx"
                />
              </td>

            </tr>}
          </tbody>
        </table>

        {/* Resume Container -----------------------------------------------------------------*/}
        {userData?.role === "jobSeeker" && !userData?.profile?.resume && (
          <div className='w-full'>
            <p onClick={handleClick} className="mb-0 cursor-pointer hover:underline text-center font-bold text-[18px] text-[#1dd1a1]">
              Add Resume
            </p>
            <input
              type="file"
              ref={resumeRef}
              onChange={(e) => handleResumeUpload(e)}
              className=" hidden "
              accept=".pdf,.doc,.docx"
            />
          </div>
        )}



        {/* company container --------------------------------------------------------------- */}
        {userData?.role === "recruiter" && <p className="w-full text-[20px] font-extrabold">Company Details</p>}
        {userData?.role === "recruiter" && !userData?.profile?.company && (
          <div className='w-full'>
            <p onClick={() => handleCreateCompany()} className="mb-0 text-center font-bold cursor-pointer text-[18px] text-[#1dd1a1] hover:underline">Add company Details
            </p>
          </div>
        )
        }

        {userData?.profile?.company && (
          <table className="w-full shadow rounded border-2 text-[16px] text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <tbody>
              <tr className="bg-white border-b  ">
                <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
                  Company Name :
                </th>
                <td className="px-6 font-medium py-4">
                  {userCompany?.name}
                </td>

                <td className="px-6 py-4 text-[18px] text-right">
                  <p title='Edit-Company' onClick={() => handleUpdateCompany()} className="font-bold cursor-pointer text-[#1dd1a1] hover:underline">Edit</p>
                </td>
              </tr>
              <tr className="bg-white border-b ">
                <th scope="row" className="px-6 py-4 font-medium  whitespace-nowrap ">
                  Industry :
                </th>
                <td className="px-6 font-medium py-4">
                  {userCompany?.industry}
                </td>
              </tr>
              <tr className="bg-white  border-b  ">
                <th scope="row" className="px-6 py-4 font-medium  whitespace-nowrap ">
                  Size :
                </th>
                <td className="px-6 font-medium py-4">
                  {userCompany?.size} employees
                </td>

              </tr>
              <tr className="bg-white  border-b  ">
                <th scope="row" className="px-6 py-4 font-medium  whitespace-nowrap ">
                  Link :
                </th>
                <td className="px-6 font-medium py-4">
                  {userCompany?.link}
                </td>

              </tr>
              <tr className="bg-white  border-b ">
                <th scope="row" className="px-6 py-4 font-medium  whitespace-nowrap ">
                  Location :
                </th>
                <td className="px-6 font-medium capitalize py-4">
                  {userCompany?.location?.city}, {userCompany?.location?.state}
                </td>
              </tr>
            </tbody>
          </table>

        )}


      </div>





      {/* popup model for update  -----------------------------------------------------------*/}

      <PopupModel isOpen={isOpen} setIsOpen={setIsOpen} name={popupFor} >
        <div>
          {/* form for create and update company details -------------------- */}
          {popupFor === "Add Company" || popupFor === "Update Company" ? (
            <div>

              <div class="mb-4">
                <label for="name" class="block text-gray-700 font-bold mb-2">Company Name:</label>
                <input value={formik.values.name} onChange={formik.handleChange} type="text" id="name" name="name" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-300" placeholder="Enter company name" />
              </div>

              <div class="mb-4">
                <label for="industry" class="block text-gray-700 font-bold mb-2">Industry:</label>
                <select value={formik.values.industry} onChange={formik.handleChange} id="industry" name="industry" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-300">
                  <option value="" disabled selected>Select industry</option>
                  <option value="agriculture">Agriculture</option>
                  <option value="automobile">Automobile</option>
                  <option value="banking">Banking</option>
                  <option value="construction">Construction</option>
                  <option value="education">Education</option>
                  <option value="energy">Energy</option>
                  <option value="fashion">Fashion</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="information_technology">Information Technology (IT)</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="media">Media</option>
                  <option value="mining">Mining</option>
                  <option value="pharmaceutical">Pharmaceutical</option>
                  <option value="real_estate">Real Estate</option>
                  <option value="retail">Retail</option>
                  <option value="telecommunications">Telecommunications</option>
                  <option value="textile">Textile</option>
                  <option value="tourism">Tourism</option>
                  <option value="transportation">Transportation</option>
                </select>
              </div>

              <div class="mb-4">
                <label for="size" class="block text-gray-700 font-bold mb-2">Company Size:</label>
                <select value={formik.values.size} onChange={formik.handleChange} id="size" name="size" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-300">
                  <option value="" disabled selected>Select company size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-100">51-100 employees</option>
                  <option value="100+">100+ employees</option>
                </select>
              </div>

              <div class="mb-4">
                <label for="link" class="block text-gray-700 font-bold mb-2">Website URL:</label>
                <input value={formik.values.link} onChange={formik.handleChange} type="url" id="link" name="link" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-300" placeholder="https://example.com" />
              </div>

              <div class="mb-4">
                <label for="location" class="block text-gray-700 font-bold mb-2">Location:</label>
                <div className="flex items-center gap-2">
                  <input value={formik.values.city} onChange={formik.handleChange} type="text" id="location" name="city" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-300" placeholder="Enter City" />
                  <input value={formik.values.state} onChange={formik.handleChange} type="text" id="" name="state" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-300" placeholder="Enter State" />
                </div>
              </div>
            </div>
          ) : popupFor === "Update Profile" ? (


            <div class="mb-4">
              <label for="username" class="block text-gray-700 font-bold mb-2"> Name:</label>
              <input value={formikProfile.values.username} onChange={formikProfile.handleChange} type="text" id="username" name="username" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-300" placeholder="Enter your name" />
            </div>

          ) : popupFor === "Update Password" ? (
            <div>
              <div class="mb-4">
                <label for="password" class="block text-gray-700 font-bold mb-2"> Current Password:</label>
                <div className='flex items-center w-full px-4 py-2 border border-gray-300 rounded-md focus-within:outline-none focus-within:ring-1 focus-within:ring-emerald-300'>
                  <input
                    value={formikPassword.values.password}
                    onChange={formikPassword.handleChange}
                    type={showPasswordFor === "password" ? "text" : "password"}
                    id="password"
                    name="password"
                    className="w-full bg-inherit outline-none"
                    placeholder="Password"
                  />
                  {showPasswordFor === "password" ?
                    <IoEyeOutline onClick={() => setShowPasswordFor("")} className='w-6 h-6 cursor-pointer' />
                    :
                    <IoEyeOffOutline onClick={() => setShowPasswordFor("password")} className='w-6 h-6 cursor-pointer' />
                  }
                </div>
                {formikPassword.errors.password && formikPassword.touched.password && <p className='text-red-500 text-[14px]'>{formikPassword.errors.password}</p>}

                <label for="newPassword" class="block text-gray-700 font-bold mb-2"> New Password:</label>
                <div className='flex items-center w-full px-4 py-2 border border-gray-300 rounded-md focus-within:outline-none focus-within:ring-1 focus-within:ring-emerald-300'>
                  <input
                    value={formikPassword.values.newPassword}
                    onChange={formikPassword.handleChange}
                    type={showPasswordFor === "newPassword" ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    className="w-full bg-inherit outline-none"
                    placeholder="New Password"
                  />
                  {
                    showPasswordFor === "newPassword" ?
                      <IoEyeOutline onClick={() => setShowPasswordFor("")} className='w-6 h-6 cursor-pointer' />
                      :
                      <IoEyeOffOutline onClick={() => setShowPasswordFor("newPassword")} className='w-6 h-6 cursor-pointer' />
                  }
                </div>
                {formikPassword.errors.newPassword && formikPassword.touched.newPassword && <p className='text-red-500 text-[14px]'>{formikPassword.errors.newPassword}</p>}

                <label for="confirmNewPassword" class="block text-gray-700 font-bold mb-2"> Confirm New Password:</label>
                <div className='flex items-center w-full px-4 py-2 border border-gray-300 rounded-md focus-within:outline-none focus-within:ring-1 focus-within:ring-emerald-300'>
                  <input
                    value={formikPassword.values.confirmNewPassword}
                    onChange={formikPassword.handleChange}
                    type={showPasswordFor === "ConfirmNewPassword" ? "text" : "password"}
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    className="w-full bg-inherit outline-none"
                    placeholder="Confirm Password"
                  />
                  {
                    showPasswordFor === "ConfirmNewPassword" ?
                      <IoEyeOutline onClick={() => setShowPasswordFor("")} className='w-6 h-6 cursor-pointer' />
                      :
                      <IoEyeOffOutline onClick={() => setShowPasswordFor("ConfirmNewPassword")} className='w-6 h-6 cursor-pointer' />
                  }
                </div>
                {formikPassword.errors.confirmNewPassword && formikPassword.touched.confirmNewPassword && <p className='text-red-500 text-[14px]'>{formikPassword.errors.confirmNewPassword}</p>}

              </div>
            </div>
          ) : null
          }




          <div className='w-full flex items-center justify-between'>
            <div onClick={() => handleCancel()} className="w-[30%] bg-gray-600 transition duration-300 text-white hover:bg-gray-700 cursor-pointer flex items-center justify-center py-[11px] px-4 rounded-md">
              <p className="mb-0 font-bold  text-[18px]">Cancel</p>
            </div>
            <div onClick={() => handleSubmit()} className="w-[45%] gap-2 bg-[#1dd1a1] transition duration-300 cursor-pointer text-white flex items-center justify-center py-3 px-4 rounded-md hover:bg-[#10a37f]">
              <p className="mb-0 font-bold text-[18px]">Update</p>
            </div>
          </div>
        </div>
      </PopupModel>

    </div>


  )
}

export default Profile

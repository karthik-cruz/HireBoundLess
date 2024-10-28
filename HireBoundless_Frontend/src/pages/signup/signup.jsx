import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

//assest---
import Google_Icons from '../../assets/icons/google.png'
import { FaRegUserCircle } from "react-icons/fa";


//importing Redux slices
import { fetchSignupUser } from '../../redux/slices/signupUserSlice';
import { IoEyeOffOutline, IoEyeOutline, IoLogoAmplify } from 'react-icons/io5';
import { AiOutlineMail } from 'react-icons/ai';
import { RiErrorWarningFill, RiLockPasswordLine } from 'react-icons/ri';
import Button from '../../components/buttons/button';

import { useGoogleLogin } from '@react-oauth/google';





//#1dd1a1
//#10ac84

const Signup = () => {

    const dispatch = useDispatch()
    // const [asJobSeeker, setAsJobSeeker] = useState(false)
    const [role, setRole] = useState('jobSeeker')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()


    const formik = useFormik({
        initialValues: {
            name: "",
            email: '',
            password: '',
        },

        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is Required'),
            password: Yup.string()
                .required('Password is Required'),
            name: Yup.string()
                .required(' Name is Required'),
        }),

        onSubmit: (values) => {
            setLoading(true)
            dispatch(fetchSignupUser({ name: values.name, email: values.email, password: values.password, role: role })).then((response) => {
                console.log(response, "response")
                if (response?.payload?.success) {
                    toast.success(response?.payload?.message)
                    setTimeout(() => {
                        navigate('/login')
                    }, 2000)
                    setLoading(false)
                    formik.resetForm()
                } else {
                    toast.error(response?.payload?.message)
                    setLoading(false)
                }
            })
        }
    })


    return (
        <div className='w-[100%] h-[100vh] flex items-center justify-center bg-[#1dd1a1]' >
            <div className='w-[50%] flex bg-white shadow-2xl rounded-[10px]'>
                <div className='w-[30%]  flex items-center justify-center rounded-s-[10px] px-4 bg-emerald-100'>
                    <IoLogoAmplify color='#1dd1a1' size={200} />
                </div>



                {/* form section */}
                <form onSubmit={formik.handleSubmit} className='bg-white flex flex-col rounded-e-[10px] gap-5 px-10 py-5  w-[80%]'>
                    <p className='text-center text-[30px] font-extrabold'>Sign Up</p>

                    <div className='w-full relative flex flex-col mt-2'>
                        <div className='w-[100%]  py-2 px-3 border hover:border-[#1dd1a1] gap-2 rounded-[10px] flex items-center 
                  focus-within:ring-4 focus-within:ring-green-100 focus-within:shadow-lg focus-within:border-[#1dd1a1]'>
                            <FaRegUserCircle color='' size={25} />
                            <input className='w-full ps-2 outline-none border-none' type="text" name="name" id="name" onChange={formik.handleChange} value={formik.values.name} placeholder="Name" />
                        </div>
                        {formik.touched.name && formik.errors.name && <div className='text-red-500 absolute bottom-[-18px] mt-[2px] flex items-center gap-1 w-full text-[14px]  text-start'>
                            <RiErrorWarningFill size={15} /><span className=''>{formik.errors.name}</span></div>}
                    </div>


                    <div className='w-full relative flex flex-col '>
                        <div className='w-[100%] py-2 px-3 border hover:border-[#1dd1a1] gap-2 rounded-[10px] flex items-center 
                  focus-within:ring-4 focus-within:ring-green-100 focus-within:shadow-lg focus-within:border-[#1dd1a1]'>
                            <AiOutlineMail color='' size={25} />
                            <input className='w-full ps-2 outline-none border-none' type="text" name="email" id="email" onChange={formik.handleChange} value={formik.values.email} placeholder="Email" />
                        </div>
                        {formik.touched.email && formik.errors.email && <div className='text-red-500 absolute bottom-[-18px] mt-[2px] flex items-center gap-1 w-full text-[14px]  text-start'>
                            <RiErrorWarningFill size={15} /><span className=''>{formik.errors.email}</span></div>}
                    </div>

                    <div className='w-full relative'>
                        <div className='w-[100%] py-2 px-3 border hover:border-[#1dd1a1] gap-2 rounded-[10px] flex items-center focus-within:ring-4 focus-within:ring-green-100 focus-within:shadow-lg focus-within:border-[#1dd1a1]'>
                            <RiLockPasswordLine size={25} />
                            <input className='w-full ps-2 outline-none border-none' name="password" id="password" onChange={formik.handleChange} value={formik.values.password} type={showPassword ? "text" : "password"} placeholder="Password" />

                            {showPassword ?
                                <IoEyeOutline className='cursor-pointer' color='gray' size={25} onClick={() => setShowPassword(!showPassword)} /> :
                                <IoEyeOffOutline className='cursor-pointer' color='gray' size={25} onClick={() => setShowPassword(!showPassword)} />}

                        </div>
                        {formik.touched.password && formik.errors.password && <div className='text-red-500 absolute bottom-[-18px] mt-[2px] flex items-center gap-1 w-full text-[14px] text-start'>
                            <RiErrorWarningFill size={15} /><span>{formik.errors.password}</span></div>}
                    </div>

                    <div className='w-full flex items-center mb-2 justify-end'>

                        <div className='flex gap-8'>
                            <div className='flex items-center gap-1'>
                                <input
                                    onChange={() => setRole("jobSeeker")}
                                    checked={role === "jobSeeker"}
                                    className='cursor-pointer'
                                    type="radio"
                                    id='asJobSeeker'
                                    name="role"
                                />
                                <label className='cursor-pointer text-[#10ac84] font-bold text-[14px]' htmlFor="asJobSeeker">JobSeeker</label>
                            </div>
                            <div className='flex items-center gap-1'>
                                <input
                                    onChange={() => setRole("recruiter")}
                                    checked={role === "recruiter"}
                                    className='cursor-pointer'
                                    type="radio"
                                    id='asRecruiter'
                                    name="role"
                                />
                                <label className='cursor-pointer text-[#10ac84] font-bold text-[14px]' htmlFor="asRecruiter">Recruiter</label>
                            </div>
                        </div>
                    </div>

                    {/* <p className='mb-0 font-medium text-[16px] text-[#10ac84] cursor-pointer text-end'>Forgot Password?</p> */}

                    <Button btnName="Signup" loading={loading} />
                    <p className=" text-end mb-0 text-[14px] font-bold">Already have an account? <span onClick={() => navigate('/login')} className='text-[#10ac84] cursor-pointer'>Login</span></p>

                    <div className='flex items-center mb-2 justify-between'>
                        <div className='flex cursor-pointer hover:border-[#1dd1a1] items-center border mx-auto w-[50%] border-[#10ac84] py-1 px-3 rounded-[10px] justify-center gap-2'>
                            <img width={30} src={Google_Icons} alt="" />
                            <p className="mb-0 font-medium">Signup with Google</p>
                        </div>

                    </div>




                </form>
            </div>

        </div>
    )
}

export default Signup

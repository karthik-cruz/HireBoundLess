import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import Google_Icons from '../../assets/icons/google.png'
import homeBackground from '../../assets/images/homeBackground.jpg'
//importing Redux slices
import { fetchLoginUser } from "../../redux/slices/loginUserSlice"

// react icons 
import { IoLogoAmplify } from "react-icons/io5";
import { RiLockPasswordLine } from "react-icons/ri";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { AiOutlineMail } from "react-icons/ai";
import { RiErrorWarningFill } from "react-icons/ri";
import Button from '../../components/buttons/button';


const Login = () => {


    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },

        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is Required'),
            password: Yup.string()
                .required('Password is Required'),
        }),

        onSubmit: (values) => {
            setLoading(true)
            dispatch(fetchLoginUser(values)).then((response) => {
                if (response?.payload?.success) {
                    setLoading(false);
                    toast.success(response?.payload?.message)
                    localStorage.setItem("token", response?.payload?.token)
                    localStorage.setItem("user", response?.payload?.user?._id)
                    setTimeout(() => {
                        navigate("/")
                    }, 2000)
                    formik.resetForm();
                } else {
                    toast.error(response?.payload.message || "Network issue. Please try again")
                    setLoading(false)
                }
            })
        }
    })



    return (
        //#1dd1a1
        <div className='w-[100%] h-[100vh]  bg-[#1dd1a1] flex '>


            {/* left container */}
            <div style={{ backgroundImage: `url(${homeBackground})` }}
                className={`w-[50%] bg-center bg-cover flex items-center flex-col justify-center `}>
                <IoLogoAmplify color='#1dd1a1' className='' size={500} />
            </div>



            {/* right container */}
            <div className='w-[50%] flex items-center justify-center'>

                <form onSubmit={formik.handleSubmit} className='bg-white shadow-2xl flex flex-col gap-5 px-20 py-10 rounded-[10px] w-[80%]'>
                    <div className='w-full flex items-center justify-center gap-2'>
                        <IoLogoAmplify color='#1dd1a1' size={45} />
                        <p className="m-0 font-extrabold text-[30px]">HireBoundless</p>
                    </div>


                    <div className='w-full flex flex-col mt-2'>
                        <div className='w-[100%] py-2 px-3 border hover:border-[#1dd1a1] gap-2 rounded-[10px] flex items-center 
                  focus-within:ring-4 focus-within:ring-green-100 focus-within:shadow-lg focus-within:border-[#1dd1a1]'>
                            <AiOutlineMail color='' size={25} />
                            <input className='w-full ps-2 outline-none border-none' type="text" name="email" id="email" onChange={formik.handleChange} value={formik.values.email} placeholder="Email" />
                        </div>
                        {formik.touched.email && formik.errors.email && <div className='text-red-500 mt-[2px] flex items-center gap-1 w-full text-[14px]  text-start'>
                            <RiErrorWarningFill size={15} /><span className=''>{formik.errors.email}</span></div>}
                    </div>

                    <div className='w-full'>
                        <div className='w-[100%] py-2 px-3 border hover:border-[#1dd1a1] gap-2 rounded-[10px] flex items-center focus-within:ring-4 focus-within:ring-green-100 focus-within:shadow-lg focus-within:border-[#1dd1a1]'>
                            <RiLockPasswordLine size={25} />
                            <input className='w-full ps-2 outline-none border-none' name="password" id="password" onChange={formik.handleChange} value={formik.values.password} type={showPassword ? "text" : "password"} placeholder="Password" />

                            {showPassword ?
                                <IoEyeOutline className='cursor-pointer' color='gray' size={25} onClick={() => setShowPassword(!showPassword)} /> :
                                <IoEyeOffOutline className='cursor-pointer' color='gray' size={25} onClick={() => setShowPassword(!showPassword)} />}

                        </div>
                        {formik.touched.password && formik.errors.password && <div className='text-red-500 mt-[2px] flex items-center gap-1 w-full text-[14px] text-start'>
                            <RiErrorWarningFill size={15} /><span>{formik.errors.password}</span></div>}
                    </div>

                    <div className='flex items-center justify-end'>
                        <p onClick={() => navigate('/forgot-password')} className='mb-0 font-medium text-[16px] text-[#10ac84] cursor-pointer '>Forgot Password?</p>
                    </div>

                    <Button btnName="Log in" loading={loading} />
                    <p className="mb-0 text-end text-[14px] font-bold">Don't have an account? <span onClick={() => navigate('/signup')} className='text-[#10ac84] cursor-pointer'>Sign up</span></p>

                    <div className='flex items-center justify-between'>
                        <div className='flex cursor-pointer hover:border-[#1dd1a1] items-center border mx-auto w-[50%] border-[#10ac84] py-1 px-3 rounded-[10px] justify-center gap-2'>
                            <img width={30} src={Google_Icons} alt="" />
                            <p className="mb-0 font-medium">Continue with Google</p>
                        </div>

                    </div>

                </form>
            </div>

        </div>
    )
}

export default Login

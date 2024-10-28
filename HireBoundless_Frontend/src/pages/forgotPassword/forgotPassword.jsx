import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useNavigate, useLocation } from 'react-router-dom';
// icons -------------------------------------
import { AiOutlineMail } from "react-icons/ai";
import { IoLogoAmplify } from "react-icons/io5";

import { FaArrowLeft } from "react-icons/fa";
import { IoKeyOutline } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { RiErrorWarningFill } from "react-icons/ri";
//Components ----------------------------------
import Button from '../../components/buttons/button';

//  images ------------------------------------
import homeBackground from "../../assets/images/homeBackground.jpg"
//import Slices and redux -------------------------------
import { useSelector, useDispatch } from 'react-redux'
import { fetchForgotPassword } from '../../redux/slices/forgotPasswordSlice'
import { fetchVerifyOtp } from '../../redux/slices/verifyOtpSlice'
import { fetchResetPassword } from '../../redux/slices/resetPasswordSlice';

const ForgotPassword = () => {



    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    //state handling ----------------------------------------------------------------
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [OTPStatus, setOTPStatus] = useState("OTPPending")
    const [Email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)

    // Formik validation for forgot Password ----------------------------------------
    const forgotPasswordFormik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Invalid email address")
                .required("Email is required"),
        }),
        onSubmit: (values) => {
            setLoading(true)
            dispatch(fetchForgotPassword(values)).then((res) => {
                if (res.payload.success) {
                    toast.success(res.payload.message)
                    setEmail(values.email)
                    setOTPStatus("OTPSent")
                    setLoading(false)
                    forgotPasswordFormik.resetForm()
                } else {
                    toast.error(res.payload.message)
                    setLoading(false)
                }
            })
        }
    })

    // Formik validation for OTP ----------------------------------------
    const OTPFormik = useFormik({
        initialValues: {
            otp: ['', '', '', '', '', ''],

        },
        validationSchema: Yup.object({
            otp: Yup.array().of(Yup.string().required("OTP is Required"))
        }),
        onSubmit: async (values) => {
            setLoading(true)
            dispatch(fetchVerifyOtp({ otp: values.otp.join(''), email: Email })).then((response) => {
                if (response.payload.success) {
                    toast.success(response.payload.message)
                    setTimeout(() => {
                        setOTPStatus("OTPVerified")
                    }, 2000)
                    setLoading(false)
                } else {
                    toast.error(response.payload.message)
                    setLoading(false)
                }

            })
        },
    })

    // Formik validation for new password ----------------------------------------
    const resetPasswordFormik = useFormik({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        validationSchema: Yup.object({
            password: Yup.string()
                .required("Password is required"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("password"), null], "Passwords must match")
                .required("Confirm Password is required"),
        })
        ,
        onSubmit: (values) => {
            setLoading(true)
            dispatch(fetchResetPassword({ password: values.password, email: Email })).then((response) => {
                if (response.payload.message) {
                    toast.success(response.payload.message)
                    setTimeout(() => {
                        navigate("/login")
                    }, 2000)
                    setLoading(false)
                } else {
                    toast.error(response.payload.message)
                    setLoading(false)
                }
            })
        },
    })



    const handleChange = (e, index) => {
        const value = e.target.value;
        if (/^\d$/.test(value)) {
            OTPFormik.setFieldValue(`otp.${index}`, value);
            if (index < 5) {
                document.getElementById(`otp-${index + 1}`).focus();
            }
        }
    };

    // Function to handle backspace and delete
    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' || e.key === 'Delete') {
            if (OTPFormik.values.otp[index] === '') {
                if (index > 0) {
                    document.getElementById(`otp-${index - 1}`).focus();
                }
            } else {
                OTPFormik.setFieldValue(`otp.${index}`, ''); // Clear the current box
            }
        }
    };

    return (

        <div style={{ backgroundImage: `url(${homeBackground})` }}
            className="h-[100vh] w-[100%] bg-cover bg-center">
            <div className='flex ms-4  gap-2 items-center'>
                <IoLogoAmplify color='#1dd1a1' className='' size={50} />
                <p className="mb-0 font-extrabold text-[30px]">HireBoundless</p>
            </div>

            <div style={{ boxShadow: "rgba(0, 0, 0, 0.45) 0px 5px 55px" }} className='bg-[rgba(255,255,255,0.85)] border-4 border-white rounded-[10px] mx-auto my-14 flex w-[35%] h-[70%]' >


                {/* Form section ------------------------------------------------------------------------*/}
                <div className=' flex items-center flex-col  w-[100%] '>
                    <p className={`mb-0 mt-[20px] text-[35px] font-extrabold`}>{OTPStatus === "OTPPending" ? "Forgot Your Password ?" : OTPStatus === "OTPSent" ? "Enter OTP" : "Reset Password"}</p>

                    {/* forgot password form ------------------------------------------------ */}
                    {OTPStatus === "OTPPending" &&
                        <form className='flex flex-col gap-4 items-center w-[70%] mt-[60px]' onSubmit={forgotPasswordFormik.handleSubmit} action="" >
                            <div className='w-full flex flex-col '>
                                <p className=' text-gray-500 my-[20px] font-semibold text-[17px]'>Enter email address to receive OTP </p>
                                <div className='w-[100%] py-2 px-3 border hover:border-[#1dd1a1] gap-2 rounded-[10px] flex items-center 
                  focus-within:ring-4 focus-within:ring-green-100 focus-within:shadow-lg focus-within:border-[#1dd1a1]'>
                                    <AiOutlineMail color='' size={25} />
                                    <input className='w-full ps-2 outline-none border-none' type="text" name="email" id="email" onChange={forgotPasswordFormik.handleChange} value={forgotPasswordFormik.values.email} placeholder="Email" />
                                </div>
                                {forgotPasswordFormik.touched.email && forgotPasswordFormik.errors.email && <div className='text-red-500 mt-[2px] flex items-center gap-1 w-full text-[14px]  text-start'>
                                    <RiErrorWarningFill size={15} /><span className=''>{forgotPasswordFormik.errors.email}</span></div>}
                            </div>
                            <Button btnName="Send OTP" loading={loading} />
                        </form>}

                    {
                        OTPStatus === "OTPSent" &&
                        // OTP verification form -----------------------------------------------------------------
                        <form onSubmit={OTPFormik.handleSubmit}>

                            <p className=' text-gray-500 my-[20px] font-semibold text-[17px]'>Enter 6 digit OTP </p>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                {OTPFormik.values.otp.map((digit, index) => (
                                    <input className='border-2 mb-10 outline-none hover:border-[#1dd1a1] rounded-[10px] 
                  focus-within:ring-4 focus-within:ring-green-100 font-bold focus-within:shadow-lg focus-within:border-[#1dd1a1]'
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        name={`otp[${index}]`}
                                        maxLength="1"
                                        value={OTPFormik.values.otp[index]}
                                        onChange={(e) => handleChange(e, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        style={{
                                            width: '50px',
                                            height: '50px',
                                            fontSize: '24px',
                                            textAlign: 'center'
                                        }}
                                    />

                                ))}
                            </div>
                            <Button btnName="Submit" loading={loading} />
                        </form>
                    }
                    {
                        OTPStatus === "OTPVerified" &&
                        // Reset Password verification form -----------------------------------------------------------------
                        <form className='flex flex-col gap-4 items-center w-[70%] mt-[60px]' onSubmit={resetPasswordFormik.handleSubmit} action="" >
                            <div className='w-full'>
                                <p className=' text-gray-500 my-[20px] font-semibold text-[17px]'>Enter New Password </p>
                                <div className='w-[100%] py-2 px-3 border hover:border-[#1dd1a1] gap-2 rounded-[10px] flex items-center focus-within:ring-4 focus-within:ring-green-100 focus-within:shadow-lg focus-within:border-[#1dd1a1]'>
                                    <IoKeyOutline size={25} />
                                    <input className='w-full ps-2 outline-none border-none' type={showPassword ? "text" : "password"} name="password" id="password" onChange={resetPasswordFormik.handleChange} value={resetPasswordFormik.values.password} placeholder='New Password' />
                                    {showPassword ? <IoEyeOutline size={25} color='gray' onClick={() => setShowPassword(!showPassword)} /> : <IoEyeOffOutline size={25} color='gray' onClick={() => setShowPassword(!showPassword)} />}
                                </div>
                                {resetPasswordFormik.touched.password && resetPasswordFormik.errors.password && <div className='text-red-500 w-full mt-[2px] flex items-center gap-1 text-[14px] text-start'><RiErrorWarningFill size={15} /><span>{resetPasswordFormik.errors.password}</span></div>}
                            </div>

                            <div className='w-full'>

                                <div className='w-[100%] py-2 px-3 border hover:border-[#1dd1a1] gap-2 rounded-[10px] flex items-center focus-within:ring-4 focus-within:ring-green-100 focus-within:shadow-lg focus-within:border-[#1dd1a1]'>
                                    <IoKeyOutline size={25} />
                                    <input className='w-full ps-2 outline-none border-none' type={showConfirmPassword ? "text" : "password"} name="confirmPassword" id="otp" onChange={resetPasswordFormik.handleChange} value={resetPasswordFormik.values.confirmPassword} placeholder='Confirm New Password' />
                                    {showConfirmPassword ? <IoEyeOutline size={25} color='gray' onClick={() => setShowConfirmPassword(!showConfirmPassword)} /> : <IoEyeOffOutline size={25} color='gray' onClick={() => setShowConfirmPassword(!showConfirmPassword)} />}
                                </div>
                                {resetPasswordFormik.touched.confirmPassword && resetPasswordFormik.errors.confirmPassword && <div className='text-red-500 w-full mt-[2px] flex items-center gap-1 text-[14px] text-start'><RiErrorWarningFill size={15} /><span>{resetPasswordFormik.errors.confirmPassword}</span></div>}
                            </div>

                            <Button btnName="Reset Password" loading={loading} />
                        </form>
                    }
                    <div onClick={() => navigate("/login")} className={`text-[#10ac84] hover:text-[#1dd1a1] underline cursor-pointer flex items-center gap-1 ${OTPStatus === "OTPSent" && OTPStatus === "OTPPending" ? "mt-[150px]" : "mt-[70px]"}`}>
                        <FaArrowLeft className='' color='' size={15} />
                        <span className='font-bold'>Back to Login</span>
                    </div>
                </div>


            </div>



        </div>
    )
}

export default ForgotPassword

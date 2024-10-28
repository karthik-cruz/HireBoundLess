import React, { useState, useRef, useEffect } from 'react'
import { IoLogoAmplify } from 'react-icons/io5'
import NavTabs from '../../components/navTabs/navTabs'
import { MdOutlineLogout } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import EmptyImg from "../../assets/images/EmptyAvatar.png"
import { AiOutlineUserAdd } from "react-icons/ai";
import { useSelector, useDispatch } from 'react-redux';
import domain_URL from '../../config/config';
import { persistor } from '../../redux/store';





const Header = () => {

    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const dropdownRef = useRef(null); // Reference for the dropdown container
    const notificationRef = useRef(null); // Reference for the notification container 
    const navigate = useNavigate()

    const dispatch = useDispatch()
    const userData = useSelector(state => state?.getUser?.user)



    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const toggleNotification = () => {
        setIsNotificationOpen(!isNotificationOpen);
    };


    // Close the dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Close dropdown if clicked outside
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }

            // Close notification if clicked outside
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsNotificationOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);



    const handleLogout = () => {
        localStorage.clear()
        // Dispatch the logout action to clear state
        dispatch({ type: 'logout' });
        // Optionally, clear persisted state to reset even after page reload
        persistor.purge();
        // Redirect to login page after logout
        navigate('/login');

    }

    const handleProfile = () => {
        navigate("/profile")
    }

    return (
        <div className='shadow  px-6 h-[70px] flex justify-between items-center'>

            <div onClick={() => navigate("/jobs")} className='flex items-center cursor-pointer gap-2'>
                <IoLogoAmplify color='#1dd1a1' size={45} />
                <p className="m-0 font-extrabold text-[30px]">HireBoundless</p>
            </div>





            {/* navTabs ----------------------------------------------------------- */}
            <div className='flex items-center gap-20'>

                <NavTabs />

                {/* notification and profile setting components ---------------------------- */}
                <div className='flex items-center gap-8'>
                    <div onClick={toggleNotification} ref={notificationRef} className='border-2 w-[40px] h-[40px] relative text-[#10ac84] p-1 rounded-full cursor-pointer hover:border-[#197b66] hover:text-[#197b66] '>
                        <IoNotifications className=' w-full h-full' />
                        {isNotificationOpen && (
                            <div className={`absolute bg-white top-[48px] p-2 right-0 mt-2 w-54 border rounded-lg shadow-2xl z-10`}>
                                <div className='w-[100px] py-2 gap-2 flex-col flex items-center'>

                                    <p className='mb-0 text-black'>No notification</p>

                                </div>
                            </div>
                        )}
                    </div>


                    <div ref={dropdownRef} onClick={toggleDropdown} className='border-2 w-[40px] h-[40px] relative text-[#10ac84] p-[1px] rounded-full cursor-pointer hover:border-[#197b66] hover:text-[#197b66] '>
                        {/* <FaUserCircle size={25} className='' /> */}
                        {userData?.profile?.avatar ?

                            <img className='rounded-full w-full h-full object-cover'
                                src={`${domain_URL}/uploads/avatars/${userData?.profile?.avatar}`}
                                alt="..." title="profile_image" /> :

                            <img className='rounded-full w-full h-full object-cover'
                                src={EmptyImg}
                                alt="..." title="profile_image" />

                        }

                        {isDropdownOpen && (
                            <div className={`absolute bg-white top-[48px] p-2 right-0 mt-2 w-54 border rounded-lg shadow-2xl z-10`}>
                                <div className='border-b w-[100%] py-2 gap-2 flex items-center'>
                                    <div className='rounded-full cursor-pointer border w-[40px] h-[40px] p-[2px] border-[#10ac84]' onClick={toggleDropdown}>
                                        {/* <img className='w-full h-full rounded-full' src={EmptyImg} alt="User avatar" /> */}

                                        {userData?.profile?.avatar ?

                                            <img className='rounded-full w-full h-full object-cover'
                                                src={`${domain_URL}/uploads/avatars/${userData?.profile?.avatar}`}
                                                alt="..." title="profile_image" /> :

                                            <img className='rounded-full w-full h-full object-cover'
                                                src={EmptyImg}
                                                alt="..." title="profile_image" />

                                        }
                                    </div>

                                    <div className='flex flex-col'>
                                        <p className='mb-0 text-black font-medium capitalize'>{userData?.name.slice(0, 20)}</p>
                                        <p className='mb-0 text-gray-500 text-[14px]'>{userData?.email.slice(0, 30)}</p>
                                    </div>

                                </div>



                                <div className='block'>

                                    <div onClick={handleProfile} className='flex text-black  items-center hover:bg-[#1dd1a1] hover:text-white cursor-pointer gap-2 rounded mt-2 py-1 px-2'>
                                        <AiOutlineUserAdd className='' />
                                        <p className="mb-0 font-medium ">Profile</p>
                                    </div>

                                    <div onClick={handleLogout} className='flex text-red-400  items-center hover:bg-red-400 hover:text-white cursor-pointer gap-2 rounded mt-1 py-1 px-2'>
                                        <MdOutlineLogout className='' />
                                        <p className="mb-0 font-medium ">Logout</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>








        </div>
    )
}

export default Header
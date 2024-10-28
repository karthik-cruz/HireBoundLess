import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../container/header/header'
import Footer from '../container/footer/footer'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { fetchGetUser } from '../redux/slices/getUserSlice'



const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        const skipped = localStorage.getItem('skipped');
        if (!token && !user) {
            navigate('/login');
        } else {
            dispatch(fetchGetUser(user)).then((response) => {
            
                // const userData = response?.payload?.user;
                // if (!userData?.profile && !skipped) {
                //     if (userData?.role === 'recruiter' || userData?.role === 'jobSeeker') {
                //         navigate('/details');
                //     }
                // }
                // console.log(userData?.role);
            }
            );
        }
    }, []);

    return (
        <div className=''>
            <Header />
            <Outlet />
            <Footer />
        </div>
    )
}

export default Layout

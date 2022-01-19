/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useRef, useEffect } from 'react'
import { HiMenu } from 'react-icons/hi'
import { AiFillCloseCircle } from 'react-icons/ai'
import { Link, Route, Routes } from 'react-router-dom'

import Pins from './Pins'
import { userQuery } from '../utils/data'
import { Sidebar, UserProfile } from '../components'
import { client } from '../client'
import logo from '../assets/logo-removebg.png'

const Home = () => {

    const [ToggleSideBar, setToggleSidebar] = useState(false);
    const [user, setuser] = useState(null)
    const scrollRef = useRef(null)

    const userInfo = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();

    useEffect(() => {
        const query = userQuery(userInfo?.googleId);
        client.fetch(query)
            .then((data) => {
                setuser(data[0]);
            })
    }, [])

    useEffect(() => {
        scrollRef.current?.scrollTo(0, 0)
    }, [])

    return (
        <div className='flex bg-gray-50 md:flex-row flex-col h-full transition-height duration-75 ease-out'>
            <div className='hidden md:flex h-screen flex-initial'>

                {/* this means, this div will only shown in the medium devices */}
                <Sidebar user={user && user} />
            </div>
            <div className='flex md:hidden flex-row'>
                <div className='p-2 w-full flex flex-row justify-between items-center shadow-md'>
                    <HiMenu fontSize={40} className='cursor-pointer' onClick={() => setToggleSidebar(true)} />
                    <Link to="/">
                        <img
                            src={logo}
                            alt="logo"
                            className='w-28'
                        />
                    </Link>

                    <Link to={`user-profile/${user?._id}`}>
                        <img
                            src={user?.image}
                            alt="User Photo"
                            className='w-28 rounded-md'
                        />
                    </Link>
                </div>
            </div>
            {ToggleSideBar && (
                <div className='fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in'>
                    <div className='absolute w-full flex justify-end items-center p-2'>
                        <AiFillCloseCircle
                            fontSize={30}
                            className="cursor-pointer"
                            onClick={() => setToggleSidebar(false)}
                        />
                    </div>
                    <Sidebar user={user && user} closeToggle={setToggleSidebar} />
                </div>
            )}
            <div className='pb-2 flex-1 h-screen overflow-y-scroll ref={scrollRef}'>
                <Routes>
                    <Route path="/user-profile/:userId" element={<UserProfile />} />
                    <Route path="/*" element={<Pins user={user && user} />} />
                </Routes>
            </div>
        </div>
    )
}

export default Home

import React, { useState, useEffect } from 'react'
import { AiOutlineLogout } from 'react-icons/ai'
import { useParams, useNavigate } from 'react-router-dom'
import { GoogleLogout } from 'react-google-login'

import { UserCreatedPinQuery, userQuery, userSavedPinsQuery } from '../utils/data'
import { client } from '../client'
import MassionaryLayout from './MassionaryLayout'
import Spinner from './Spinner'

const randomImg = 'https://source.unsplash.com/random/1600x900/?nature,car,technology'

const UserProfile = () => {
    const [user, setuser] = useState(null);
    const [pins, setPins] = useState(null);
    const [text, setText] = useState('Created');
    const [activeBtn, setActiveBtn] = useState('created');
    const navigate = useNavigate();

    const { userId } = useParams();

    const logout = () => {
        localStorage.clear();
        navigate('/login');
    }

    useEffect(() => {
        const query = userQuery(userId);

        client.fetch(query)
            .then((data) => {
                setuser(data[0]);
            })

    }, [userId])

    useEffect(() => {
        if (text === 'Created') {
            const createdPinsQuery = UserCreatedPinQuery(userId);
            client.fetch(createdPinsQuery)
                .then((data) => setPins(data))
        } else {
            const savedPinsQuery = userSavedPinsQuery(userId);
            client.fetch(savedPinsQuery)
                .then((data) => setPins(data))
        }
    }, [userId, text])

    const activeBtnStyle = 'bg-red-500 text-white font-bold p-2 rounded-full width-20 outline-none'
    const NotActiveBtnStyle = 'bg-primary mr-4 text-black font-bold p-2 rounded-full width-20 outline-none'

    if (!user) return <Spinner message="Loading Profile" />
    return (
        <div className='relative pb-2 h-ful justify-center items-center'>
            <div className='flex flex-col pb-5'>
                <div className='relative flex flex-col mb-7'>
                    <div className='flex flex-col justify-center items-center'>
                        <img
                            src={randomImg}
                            alt=""
                            className='w-full h-370 xl:510 shadow-lg object-cover'
                            alt="banner-picture"
                        />
                        <img
                            src={user.image}
                            alt="user-pic"
                            className='rounded-full w-20 h-20 -mt-10 shadow-xl object-cover border-2 border-double'
                        />
                        <h1 className='font-bold text-3xl text-center mt-3 capitalize'>{user.userName}</h1>
                        <div className='absolute top-0 z-1 right-0 p-2'>
                            {userId === user._id && (
                                < GoogleLogout
                                    clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
                                    render={(renderProps) => (
                                        <button
                                            type='button'
                                            className='bg-white p-2 rounded-full cursor-pointer outline-none shadow-md hover:shadow-lg'
                                            onClick={renderProps.onClick}
                                            disabled={renderProps.disabled}
                                        >
                                            <AiOutlineLogout color='red' fontSize={21} />
                                        </button>
                                    )}
                                    onLogoutSuccess={logout}
                                    cookiePolicy='single_host_origin'
                                />
                            )
                            }
                        </div>
                    </div>
                    <div className='text-center mb-7'>
                        <button
                            type="button"
                            onClick={(e) => {
                                setText(e.target.textContent);
                                setActiveBtn('Created');
                            }}
                            className={`${activeBtn === 'Created' ? activeBtnStyle : NotActiveBtnStyle}`}
                        >
                            Created
                        </button>

                        <button
                            type="button"
                            onClick={(e) => {
                                setText(e.target.textContent);
                                setActiveBtn('Saved');
                            }}
                            className={`${activeBtn === 'Saved' ? activeBtnStyle : NotActiveBtnStyle}`}
                        >
                            Saved
                        </button>
                    </div>
                    {pins?.length ? (
                        <div className='px-2'>
                            <MassionaryLayout pins={pins} />
                        </div>
                    ) : <div className='flex justify-center font-bold'>
                        No pins found
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default UserProfile
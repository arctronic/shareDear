import React from 'react';
import GoogleLogin from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import shareVideo from '../assets/Backgroud-1.mp4';
import logo from '../assets/logo-removebg.png'
import { client } from '../client';

const Login = () => {
    const navigate = useNavigate();

    const responseGoogle = (response) => {
        // console.log(response);
        localStorage.setItem('user', JSON.stringify(response.profileObj))
        const { name, googleId, email, imageUrl } = response.profileObj;

        const doc = {
            _id: googleId,
            _type: 'user',
            userName: name,
            image: imageUrl,
            email: email,
        }
        client.createIfNotExists(doc)
            .then(() => {
                navigate('/', { replace: true })
            })
    }
    return (
        <div className='flex justify-start items-center flex-col h-screen'>
            <div className='relative w-full h-full'>
                <video
                    src={shareVideo}
                    type="video/mp4"
                    loop
                    controls={false}
                    muted
                    autoPlay
                    className='w-full h-full object-cover'
                />
                <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
                    <div className='p-5'>
                        <img src={logo} alt="Logo" width="250px" />
                    </div>

                    <div className='shadow-2xl'>
                        <GoogleLogin
                            clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
                            render={(renderProps) => (
                                <button
                                    type='button'
                                    className='bg-blue-50 flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none'
                                    onClick={renderProps.onClick}
                                    disabled={renderProps.disabled}
                                >
                                    <FcGoogle className='mr-4' /> Sign in with google
                                </button>
                            )}
                            onSuccess={responseGoogle}
                            onFailure={responseGoogle}
                            cookiePolicy='single_host_origin'
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { client, urlfor } from '../client';
import { MdDownloadForOffline } from "react-icons/md"
import { AiTwotoneDelete } from "react-icons/ai"
import { BsFillArrowUpRightCircleFill } from "react-icons/bs"
import { fetchUser } from '../utils/FetchUser';


const Pin = ({ pin: { image, postedBy, _id, destination, save } }) => {
    const [PostHovered, SetPostHovered] = useState(false);
    const navigate = useNavigate();
    const user = fetchUser();
    console.log(save)
    const alreadySaved = !!(save?.filter((item) => item.postedBy._id === user.googleId))?.length;
    // created as boolean
    const savePin = (id) => {
        if (!alreadySaved) {
            client
                .patch(id)
                .setIfMissing({ save: [] })
                .insert('after', 'save[-1]', [{
                    _key: uuidv4(),
                    userId: user.googleId,
                    postedBy: {
                        _type: 'postedBy',
                        _ref: user.googleId
                    }
                }])
                .commit()
                .then(() => {
                    window.location.reload();
                })
        }
    }

    const deletePin = (id) => {
        client
            .delete(id)
            .then(() => {
                window.location.reload();
            })
    }

    return (
        <div className='m-2'>
            <div
                className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-100 ease-in-out'
                onMouseEnter={() => SetPostHovered(true)}
                onMouseLeave={() => SetPostHovered(false)}
                onClick={() => navigate(`/pin-detail/${_id}`)}
            >
                <img src={urlfor(image).width(240).url()} alt="user-post" className='rounded-lg w-full' />
                {PostHovered && (
                    <div className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50'
                        style={{ height: "100%" }}
                    >
                        <div className='flex items-center justify-between'>
                            <div className='flex gap-2'>
                                <a href={`${image?.asset?.url}?dl=`}
                                    download
                                    onClick={(e) => e.stopPropagation()}
                                    className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                                >
                                    <MdDownloadForOffline />
                                </a>
                            </div>
                            {alreadySaved ? (
                                <button
                                    type='button'
                                    className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'
                                >
                                    {save?.length} Saved
                                </button>
                            ) : (
                                <button
                                    type='button'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        savePin(_id);
                                    }}
                                    className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'
                                >
                                    Save
                                </button>
                            )}
                        </div>
                        <div className='flex justify-between items-center gap-2 w-full'>
                            {destination?.slice(8).length > 0 ? (
                                <a
                                    href={destination}
                                    target="_blank"
                                    className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                                    rel="noreferrer"
                                >
                                    {' '}
                                    <BsFillArrowUpRightCircleFill />
                                    {destination?.slice(8, 17)}...
                                </a>
                            ) : undefined}
                            {
                                postedBy?._id === user.googleId && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deletePin(_id);
                                        }}
                                        className='bg-white p-2 opacity-70 hover:opacity-100 text-dark font-bold text-base rounded-full hover:shadow-md outline-none'
                                    >
                                        <AiTwotoneDelete />
                                    </button>
                                )
                            }
                        </div>
                    </div>
                )}
            </div>
            <Link to={`user-profile/${postedBy?._id}`} className='flex gap-4 mt-2 items-center bg-gray-50 rounded-full p-1 hover:bg-white'
            >
                <img
                    src={postedBy?.image} alt="user-profile"
                    className='h-8 w-8 rounded-full object-cover'
                />
                <p className='font-semibold capitalize text-blue-900'>{postedBy.userName}</p>
            </Link>
        </div>
    );
};

export default Pin;

import React, { useState, useEffect } from 'react'
import { MdDownloadForOffline } from 'react-icons/md'
import { BiCommentAdd } from 'react-icons/bi'
import { Link, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { client, urlfor } from '../client'
import MassionaryLayout from './MassionaryLayout'
import { pinDetailMoreQuery, pinDetailQuery } from '../utils/data'
import Spinner from './Spinner'

const PinDetails = ({ user }) => {

    const [pins, setpins] = useState(null);
    const [pinDetail, setPinDetail] = useState(null);
    const [comment, setComment] = useState("");
    const [commenting, setCommenting] = useState(false);
    const { pinId } = useParams();

    const addComment = () => {
        if (comment) {
            setCommenting(true);
            client.patch(pinId)
                .setIfMissing({ 'comments': [] })
                .insert('after', 'comments[-1]', [{
                    comment,
                    _key: uuidv4(),
                    postedBy: {
                        _type: 'postedBy',
                        _ref: user._id
                    }
                }])
                .commit()
                .then(() => {
                    fetchPinDetails();
                    setComment('');
                    setCommenting(false);
                })
        }
    }

    const fetchPinDetails = () => {
        let query = pinDetailQuery(pinId);

        if (query) {
            client.fetch(query)
                .then((data) => {
                    setPinDetail(data[0]);
                    if (data[0]) {
                        query = pinDetailMoreQuery(data[0]);
                        client.fetch(query)
                            .then((res) => setpins(res))
                    }
                })
        }
    }

    useEffect(() => {
        fetchPinDetails();
    }, [pinId])

    if (!pinDetail) return <Spinner message="Loading pin" />
    return (
        <>        
        <div
            className='flex xl:flex-row flex-col m-auto bg-white '
            style={{ maxWidth: '1500px', borderRadius: '32px' }}
        >
            <div className='flex justify-center items-center md:items-start flex-initial'>
                <img
                    src={pinDetail?.image && urlfor(pinDetail.image).url()}
                    alt='user-post'
                    className='rounded-t-3xl rounded-b-lg'
                />
            </div>
            <div className='w-full p-5 flex-1 xl:min-w-620'>
                <div className='flex items-center justify-between'>
                    <div className='flex gap-2 items-center'>
                        <a href={`${pinDetail.image?.asset?.url}?dl=`}
                            download
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                        >
                            <MdDownloadForOffline />
                        </a>
                    </div>
                    <a href={pinDetail.destination} target="_blank" rel="noreferrer">
                        {pinDetail.destination.slice(8).length > 0 ? (
                            <a
                                href={pinDetail.destination}
                                target="_blank"
                                className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                                rel="noreferrer"
                            >
                                {' '}

                                {pinDetail.destination.slice(7, 17)}...
                            </a>
                        ) : undefined}
                    </a>
                </div>
                <div>
                    <h1 className='text-4xl font-bold break-words mt-3'>
                        {pinDetail.title}
                    </h1>
                    <p
                        className='mt-3'
                    >
                        {pinDetail.about}
                    </p>
                </div>
                <Link to={`/user-profile/${pinDetail.postedBy?._id}`} className='flex gap-2 mt-5 items-center rounded-lg hover:bg-slate-50'
                >
                    <img
                        src={pinDetail.postedBy?.image} alt="user-profile"
                        className='h-8 w-8 rounded-full object-cover'
                    />
                    <p className='font-semibold capitalize text-blue-900'>{pinDetail.postedBy.userName}</p>
                </Link>
                <h2 className='mt-5 text-2xl'>
                    Comments
                </h2>
                {console.log(pinDetail)}
                <div className='max-h-370 overflow-y-auto'>
                    {pinDetail?.comments?.map((comment, i) => (
                        <div className='flex gap-2 mt-5 items-center bg-white rounded-lg' key={i}>
                            <img src={comment.postedBy.image} alt="user-profile" className='w-10 h-10 rounded-full cursor-pointer' />
                            <div className='flex flex-col'>
                                <p className='font-bold'>
                                    {comment.postedBy.userName}
                                </p>
                                <p>
                                    {comment.comment}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='flex flex-wrap mt-6 gap-3 justify-center items-center'>
                    <Link to={`/user-profile/${pinDetail.postedBy?._id}`}
                    >
                        <img
                            src={user.image} alt="user-profile"
                            className='h-10 w-10 rounded-full cursor-pointer'
                        />
                    </Link>
                    <input
                        type="text"
                        className='flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300'
                        placeholder='Add your comment'
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}

                    />
                    <button
                        type='button'
                        className='bg-red-500 text-white rounded-full px-6 py-2 font-semibold outline-none h-10'
                        onClick={addComment}
                    >
                        {commenting ? <Spinner /> : <BiCommentAdd className='xl:text-xl text-base' />}

                    </button>
                </div>
            </div>
        </div>
            {pins?.length>0 ? (
                <>
                    <h2 className='text-center font-bold text-2xl mt-8 mb-4'>
                        More like this
                    </h2>
                    <MassionaryLayout pins={pins}/>
                </>
            ) : (
                <Spinner message="Loading More pins ..." />
            )}
        </>
    )
}

export default PinDetails

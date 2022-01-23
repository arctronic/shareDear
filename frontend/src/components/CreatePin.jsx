import React, { useState } from 'react'
import { AiOutlineCloudUpload, AiOutlineDelete } from "react-icons/ai"
import { useNavigate } from 'react-router-dom'


import { client } from '../client';
import { categories } from '../utils/data';
import Spinner from './Spinner';

const CreatePin = ({ user }) => {
    const [title, setTitle] = useState('');
    const [about, setAbout] = useState('');
    const [destination, setDestination] = useState('');
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState(null);
    const [fields, setFields] = useState(null);
    const [imageAsset, setImageAsset] = useState(null);
    const [wrongImageType, setWrongImageType] = useState(false);

    const navigate = useNavigate();
    const savePin = () => {
        if (title && about && destination && imageAsset?._id && category) {
            const doc = {
                _type: 'pin',
                title: title,
                about: about,
                destination: destination,
                image: {
                    _type: 'image',
                    asset: {
                        _type: 'reference',
                        _ref: imageAsset?._id,
                    }
                },
                userId: user._id,
                postedBy: {
                    _type: 'postedBy',
                    _ref: user._id,
                },
                category: category,
            }
            client.create(doc)
                .then(() => {
                    navigate('/');
                })
        } else {
            setFields(true);
            setTimeout(() => setFields(false), 2000);
        }
    }
    const uploadImage = (e) => {
        const { type, name } = e.target.files[0];

        if (type === 'image/png' || type === 'image/svg' || type === 'image/jpeg' || type === 'image/gif' || type === 'image/tiff') {
            setWrongImageType(false);
            setLoading(true);
            client.assets
                .upload('image', e.target.files[0], { contentType: type, filename: name })
                .then((document) => {
                    setImageAsset(document);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log('Image upload error', error);
                })
        } else {
            setWrongImageType(true);
        }
    }

    return (
        <div className='flex flex-col justify-center items-center mt-5 lg:h4/5'>
            {fields && (
                <p className='text-red-500 mb-5 text-xl transition-all duration-100 ease-in'>Please fill all the fields !</p>
            )}
            <div className='flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full'>
                <div className='bg-secondaryColor p-3 flex flex-0.7 w-full'>
                    <div className='flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-2 w-full h-420'>
                        {loading && <Spinner />}
                        {wrongImageType && <p>Wrong Image type</p>}
                        {!imageAsset ? (
                            <label>
                                <div className='flex flex-col items-center justify-center h-full'>
                                    <div className='flex flex-col justify-center items-center'>
                                        <p className='font-bold text-2xl'>
                                            <AiOutlineCloudUpload size={40} color='#FF0000' />
                                        </p>
                                        <p className='text-lg'>
                                            Click to Upload
                                        </p>
                                    </div>
                                    <p className='mt-32 text-gray-400 text-center'>
                                        Use high-quality JPG, SVG, PNG, GIF or TIFF type images <p><strong>(less than 10 megabytes)</strong></p>
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    name="upload-image"
                                    onChange={uploadImage}
                                    className='w-0 h-0'
                                />
                            </label>
                        ) : (
                            <div className='relative h-full'>
                                <img src={imageAsset?.url} alt="user-uploaded" className='h-full w-full' />
                                <button
                                    type='button'
                                    className='absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-100 ease-in-out'
                                    onClick={() => setImageAsset(null)}
                                >
                                    <AiOutlineDelete />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className='flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full'>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder='Add your title here'
                        className='outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2'
                    />
                    {user && (
                        <div className='flex gap-2 my-2 items-center bg-white rounded-lg'>
                            <img src={user.image} alt="user-profile" className='w-10 h-10 rounded-full' />
                            <p className='font-bold'>{user.userName}</p>
                        </div>
                    )}

                    <input
                        type="text"
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        placeholder='What is the image is about?'
                        className='outline-none text-base sm:text-large border-b-2 border-gray-200 p-2'
                    />

                    <input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder='About the source of the image (URL)'
                        className='outline-none text-base sm:text-large border-b-2 border-gray-200 p-2'
                    />
                    <div className='flex flex-col'>
                        <div>
                            <p className='mb-2 font-semibold text-lg sm:text-xl'>
                                Choose Pin Category
                            </p>
                            <select
                                onChange={(e) => setCategory(e.target.value)}
                                className='outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 cursor-pointer rounded accent-purple-400'
                            >
                                <option value="others" className='bg-white'>Select Category</option>
                                {categories.map((category) => (
                                    <option value={category.name} className='text-base border-0 outline-none capitalize bg-white text-black'>{category.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className='flex justify-end items-end mt-5'>
                            <button
                                type='button'
                                onClick={savePin}
                                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full hover:text-blue-100'
                            >
                                Save Pin
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreatePin

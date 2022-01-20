import React, { useState } from 'react'
import { AiOutlineCloudUpload, AiOutlineDelete } from "react-icons/ai"
import { useNavigate } from 'react-router-dom'


import { client } from '../client';
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
                                    <p className='mt-32 text-gray-400'>
                                        Use high-quality JPG, SVG, PNG, GIF or TIFF type images <strong>(less than 10 megabytes)</strong>
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
                </div>
            </div>
        </div>
    )
}

export default CreatePin

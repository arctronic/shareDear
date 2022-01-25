import React, { useState, useEffect } from 'react'
import MassionaryLayout from './MassionaryLayout'
import { client } from '../client'
import { feedQuery, searchQuery } from '../utils/data';
import Spinner from './Spinner';

const Search = ({ searchTerm }) => {

    const [pins, setpins] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (searchTerm) {
            setLoading(true);
            const query = searchQuery(searchTerm.toLowerCase());
            client.fetch(query)
                .then((data) => {
                    setpins(data);
                    setLoading(false);
                })
        } else {
            client.fetch(feedQuery)
                .then((data) => {
                    setpins(data);
                    setLoading(false);
                })
        }
    }, [searchTerm])

    return (
        <div>
            {loading && <Spinner message="Searching for pins" />}
            {pins?.length !== 0 && <MassionaryLayout pins={pins} />}
            {pins?.length === 0 && searchTerm !== '' && !loading && (
                <div className='mt-10 text-center text-xl'>
                    No pins found
                </div>
            )}
        </div>
    )
}

export default Search

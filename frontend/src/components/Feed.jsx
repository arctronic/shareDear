import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { client } from '../client'
import { feedQuery, searchQuery } from '../utils/data'

import MassionaryLayout from './MassionaryLayout'
import Spinner from './Spinner'

const Feed = () => {
    const [loading, setLoading] = useState(false);
    const [pins, setPins] = useState(null)
    const { categoryId } = useParams();

    useEffect(() => {
        setLoading(true);
        if (categoryId) {
            const query = searchQuery(categoryId);
            client.fetch(query)
                .then((data) => {
                    setPins(data);
                    setLoading(false)
                })

        } else {
            client.fetch(feedQuery)
                .then((data) => {
                    setPins(data);
                    setLoading(false);
                })
        }
    }, [categoryId])

    if (loading) return (<Spinner message="Adding new shares in your feed!" />);
    return (
        <div>
            {pins && <MassionaryLayout pins={pins} />}
        </div>
    )
}

export default Feed

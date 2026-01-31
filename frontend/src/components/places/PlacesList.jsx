import React, { useEffect, useState } from 'react'
import PlaceListItem from './PlaceListItem'
import { fetchPlacesApi } from '../../config/api'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import Spinner from '../layouts/Spinner'
import Pusher from 'pusher-js'
import Echo from 'laravel-echo'

export default function PlacesList() {
    const [places, setPlaces] = useState([])
    const { token } = useSelector(state => state.user) 
    const [loading, setLoading] = useState(false)

    const updatePlaceInList = (updatedPlace) => {
        setPlaces(prevPlaces => prevPlaces.map(
            place => place.id === updatedPlace.id ? updatedPlace : place
        ))
    }

    useEffect(() => {
        const fetchPlaces = async () => {
            setLoading(true)
            try {
                const data = await fetchPlacesApi(token)
                setPlaces(data)
            } catch (error) {
                toast.error('Failed to fetch the places.Please try again later.')
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        fetchPlaces()
        listenToThePlaceEvent()
    }, [])

    const listenToThePlaceEvent = () => {
        //setup laravel echo
        window.Pusher = Pusher 
        const echo = new Echo({
            broadcaster: 'pusher',
            key: 'zkn74klwnhkjynekovik',
            wsHost: 'localhost',
            wsPort: 8080,
            cluster: 'mt1',
            forceTLS: false,
            encrypted: false,
            disableStats: true,
            authEndpoint: 'http://127.0.0.1:8000/api/broadcasting/auth',
            auth: {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        })

        echo.private('places')
            .listen('.placeUpdated', (event) => {
                const updatedPlace = event.place
                updatePlaceInList(updatedPlace)
            })
    }

    return (
        <div className="row my-4">
            {
                loading ?
                    <Spinner />
                :
                <PlaceListItem 
                    places={places}
                    updatePlaceInList={updatePlaceInList}    
                />
            }
        </div>
    )
}

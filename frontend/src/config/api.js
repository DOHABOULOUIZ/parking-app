import axios from "axios"
import { toast } from "react-toastify"
import Swal from 'sweetalert2'

const API_BASE_URL = "http://127.0.0.1:8000/api"

const getConfig = (token) => {
    const config = {
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }

    return config
}

export const handlePlaceRequest = async (requestFn, updatePlaceInList, onPaymentRequired = null) => {
    try {
        const res = await requestFn()
        //check for errors
        if (res.data.error) {
            toast.error(res.data.error)
        } else if (res.data.paymentError && res.data.payment_url) {
            // Handle unpaid reservation
            Swal.fire({
                title: res.data.paymentError,
                icon: "info",
                html: `
                  You can pay it from,
                  <a href=${res.data.payment_url} autofocus>here</a>
                `,
                showConfirmButton: false
            });
        } else if (res.data.reservation && res.data.message && res.data.message.includes("Parking ended")) {
            // Show payment modal when parking ends
            toast.success(res.data.message)
            updatePlaceInList(res.data.place)
            if (onPaymentRequired) {
                onPaymentRequired(res.data.reservation)
            }
        } else {
            updatePlaceInList(res.data.place)
            toast.success(res.data.message)
        }
    } catch (error) {
        if (error?.response?.status === 404) {
            toast.error("Reservation not found or not available.")
        } else {
            toast.error("Something went wrong please try again later.")
            console.log(error)
        }
    }
}

//fetch all places
export const fetchPlacesApi = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/places`, getConfig(token))
        return response.data.data
    } catch (error) {
        throw error
    }
}

//register new user
export const registerUserApi = async (user) => {
    try {
        const res = await axios.post(`${API_BASE_URL}/user/register`,
            user
        )
        return res.data
    } catch (error) {
        throw error
    }
}


//login users
export const loginUserApi = async (user) => {
    try {
        const res = await axios.post(`${API_BASE_URL}/user/login`,
            user
        )
        return res.data
    } catch (error) {
        throw error
    }
}

//logout user
export const logoutUserApi = async (token) => {
    try {
        const res = await axios.post(`${API_BASE_URL}/user/logout`, {}, getConfig(token))
        return res.data
    } catch (error) {
        throw error
    }
}

//get the logged in user
export const getLoggedInUserApi = async (token) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/user`, getConfig(token))
        return res.data
    } catch (error) {
        throw error
    }
}

//check if the payment is done successfully
export const checkPaymentSuccessApi = async (paymentData, token) => {
    try {
        const res = await axios.post(`${API_BASE_URL}/pay/check`,
            paymentData, getConfig(token))
        return res.data
    } catch (error) {
        throw error
    }
}

//API Calls
export const reservePlaceApi = (placeId, token) => axios.post(`${API_BASE_URL}/book/reservation`, {
    place_id: placeId
}, getConfig(token))
export const cancelReservationApi = (reservation, token) => axios.put(`${API_BASE_URL}/cancel/${reservation}/reservation`, {}, getConfig(token))
export const startParkingApi = (reservation, token) => axios.put(`${API_BASE_URL}/start/${reservation}/parking`, {}, getConfig(token))
export const endParkingApi = (reservation, token) => axios.put(`${API_BASE_URL}/end/${reservation}/parking`, {}, getConfig(token))

//Get reservation details
export const getReservationDetailsApi = async (reservationId, token) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/reservation/${reservationId}`, getConfig(token))
        return res.data
    } catch (error) {
        throw error
    }
}

//Create payment session
export const createPaymentSessionApi = async (reservationId, token) => {
    try {
        const res = await axios.post(`${API_BASE_URL}/pay/create/${reservationId}`, {}, getConfig(token))
        return res.data
    } catch (error) {
        throw error
    }
}
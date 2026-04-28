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
        } else if (res.data.pending_approval && res.data.approval_message) {
            // Show approval pending message
            toast.success(res.data.message)
            updatePlaceInList(res.data.place)
            Swal.fire({
                title: 'Réservation en attente',
                text: res.data.approval_message,
                icon: 'info',
                confirmButtonText: 'J\'ai compris',
                allowOutsideClick: true,
                allowEscapeKey: true
            }).then(() => {
                // Force page reload to refresh the state
                window.location.reload()
            })
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

//fetch all places (paginated)
export const fetchPlacesApi = async (token, page = 1, perPage = 6) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/places?page=${page}&per_page=${perPage}`, getConfig(token))
        return response.data  // { data: [], current_page, last_page, total, ... }
    } catch (error) {
        throw error
    }
}

// get user's own reservations
export const getMyReservationsApi = async (token) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/user/reservations`, getConfig(token))
        return res.data.data
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

// Admin Dashboard
export const getAdminDashboardApi = async (token) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/admin/dashboard`, getConfig(token))
        return res.data
    } catch (error) {
        throw error
    }
}

// Admin Users
export const getAdminUsersApi = async (token) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/admin/users`, getConfig(token))
        return res.data
    } catch (error) {
        throw error
    }
}

export const updateAdminUserApi = async (userId, data, token) => {
    try {
        const res = await axios.put(`${API_BASE_URL}/admin/users/${userId}`, data, getConfig(token))
        return res.data
    } catch (error) {
        throw error
    }
}

export const deleteAdminUserApi = async (userId, token) => {
    try {
        const res = await axios.delete(`${API_BASE_URL}/admin/users/${userId}`, getConfig(token))
        return res.data
    } catch (error) {
        throw error
    }
}

export const changeUserRoleApi = async (userId, role, token) => {
    try {
        const res = await axios.post(`${API_BASE_URL}/admin/users/${userId}/change-role`, { role }, getConfig(token))
        return res.data
    } catch (error) {
        throw error
    }
}

// Admin Places
export const getAdminPlacesApi = async (token, page = 1) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/admin/places?page=${page}`, getConfig(token))
        return res.data
    } catch (error) {
        throw error
    }
}

export const createAdminPlaceApi = async (data, token) => {
    try {
        console.log('🔹 createAdminPlaceApi appelée');
        console.log('   Data:', data);
        console.log('   Token:', token ? '✅' : '❌ ABSENT');
        console.log('   URL:', `${API_BASE_URL}/admin/places`);

        const res = await axios.post(`${API_BASE_URL}/admin/places`, data, getConfig(token))

        console.log('🔹 Réponse API reçue:', res.data);
        return res.data
    } catch (error) {
        console.error('🔹 Erreur API:', error.message);
        console.error('🔹 Réponse erreur:', error.response?.data);
        throw error
    }
}

export const updateAdminPlaceApi = async (placeId, data, token) => {
    try {
        const res = await axios.put(`${API_BASE_URL}/admin/places/${placeId}`, data, getConfig(token))
        return res.data
    } catch (error) {
        throw error
    }
}

export const deleteAdminPlaceApi = async (placeId, token) => {
    try {
        const res = await axios.delete(`${API_BASE_URL}/admin/places/${placeId}`, getConfig(token))
        return res.data
    } catch (error) {
        throw error
    }
}

// Admin Sectors
export const getAdminSectorsApi = async (token) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/admin/sectors`, getConfig(token))
        return res.data
    } catch (error) {
        throw error
    }
}

export const createAdminSectorApi = async (data, token) => {
    try {
        const res = await axios.post(`${API_BASE_URL}/admin/sectors`, data, getConfig(token))
        return res.data
    } catch (error) {
        throw error
    }
}

export const updateAdminSectorApi = async (sectorId, data, token) => {
    try {
        const res = await axios.put(`${API_BASE_URL}/admin/sectors/${sectorId}`, data, getConfig(token))
        return res.data
    } catch (error) {
        throw error
    }
}

export const deleteAdminSectorApi = async (sectorId, token) => {
    try {
        const res = await axios.delete(`${API_BASE_URL}/admin/sectors/${sectorId}`, getConfig(token))
        return res.data
    } catch (error) {
        throw error
    }
}

// Admin Reservations
export const getAdminReservationsApi = async (token) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/admin/reservations`, getConfig(token))
        return res.data
    } catch (error) {
        throw error
    }
}

export const cancelAdminReservationApi = async (reservationId, token) => {
    try {
        const res = await axios.post(`${API_BASE_URL}/admin/reservations/${reservationId}/cancel`, {}, getConfig(token))
        return res.data
    } catch (error) {
        throw error
    }
}

export const approveAdminReservationApi = async (reservationId, token) => {
    try {
        const res = await axios.post(`${API_BASE_URL}/admin/reservations/${reservationId}/approve`, {}, getConfig(token))
        return res.data
    } catch (error) {
        throw error
    }
}

export const rejectAdminReservationApi = async (reservationId, reason, token) => {
    try {
        const res = await axios.post(`${API_BASE_URL}/admin/reservations/${reservationId}/reject`, { reason }, getConfig(token))
        return res.data
    } catch (error) {
        throw error
    }
}

export const deleteAllReservationsApi = async (token) => {
    try {
        const res = await axios.delete(`${API_BASE_URL}/admin/reservations/delete-all`, getConfig(token))
        return res.data
    } catch (error) {
        throw error
    }
}

// Axios API Client with interceptor support
export const createApiClient = (token) => {
    const instance = axios.create({
        baseURL: API_BASE_URL,
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    return instance
}

export const apiClient = createApiClient('')

// Admin Tasks
export const getAdminTasksApi = async (token) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/admin/tasks`, getConfig(token))
        return res.data
    } catch (error) {
        throw error
    }
}

export const getAdminTaskStatisticsApi = async (token) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/admin/tasks/statistics`, getConfig(token))
        return res.data
    } catch (error) {
        throw error
    }
}

export const createAdminTaskApi = async (data, token) => {
    try {
        const res = await axios.post(`${API_BASE_URL}/admin/tasks`, data, getConfig(token))
        return res.data
    } catch (error) {
        throw error
    }
}

export const getAdminTaskApi = async (taskId, token) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/admin/tasks/${taskId}`, getConfig(token))
        return res.data
    } catch (error) {
        throw error
    }
}

export const updateAdminTaskApi = async (taskId, data, token) => {
    try {
        const res = await axios.put(`${API_BASE_URL}/admin/tasks/${taskId}`, data, getConfig(token))
        return res.data
    } catch (error) {
        throw error
    }
}

export const deleteAdminTaskApi = async (taskId, token) => {
    try {
        const res = await axios.delete(`${API_BASE_URL}/admin/tasks/${taskId}`, getConfig(token))
        return res.data
    } catch (error) {
        throw error
    }
}
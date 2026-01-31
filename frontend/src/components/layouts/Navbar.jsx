import React, { useEffect } from 'react'
import { NavLink } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { getLoggedInUserApi, logoutUserApi } from '../../config/api'
import { logout, setCredentials } from '../../redux/slices/userSlice'
import { toast } from 'react-toastify'

export default function Navbar() {
    const { user, token } = useSelector(state => state.user)
    const dispatch = useDispatch()

    useEffect(() => {
        //get the logged in user
        const getLoggedInUser = async () => {
            try {
                const data = await getLoggedInUserApi(token)
                dispatch(setCredentials({user: data.user, token: data.access_token}))
            } catch (error) {
                if(error?.response?.status === 401) {
                    dispatch(logout())
                }
                console.log(error)
            }
        }
        if(token) getLoggedInUser()
    }, [token])

    //logout the user
    const logoutUser = async () => {
        try {
            const data = await logoutUserApi(token)
            dispatch(logout())
            toast.success(data.message)
        } catch (error) {
            toast.error("Something went wrong please try again later.")
            console.log(error)
        }
    }

    return (
        <ul className="nav nav-underline mt-4 justify-content-center">
            <li className="nav-item">
                <NavLink className="nav-link" aria-current="page" to="/">
                    <i className="bi bi-house-door-fill"></i> Home
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink className="nav-link" aria-current="page" to="/profile">
                    <i className="bi bi-person"></i> { user?.name }
                </NavLink>
            </li>
            <li className="nav-item">
                <button className="nav-link" aria-current="page"
                    onClick={() => logoutUser()}
                >
                    <i className="bi bi-person-fill-down"></i> Logout
                </button>
            </li>
        </ul>
    )
}

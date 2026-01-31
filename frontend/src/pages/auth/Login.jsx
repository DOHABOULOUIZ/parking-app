import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import useValidation from '../../components/custom/useValidation'
import Spinner from '../../components/layouts/Spinner'
import { loginUserApi } from '../../config/api'
import { useDispatch, useSelector } from 'react-redux'
import { setCredentials } from '../../redux/slices/userSlice'

export default function Register() {
    const { isLoggedIn } = useSelector(state => state.user) 
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: ''
    })
    const dispatch = useDispatch()
    const [validationErrors, setValidationErrors] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if(isLoggedIn) navigate('/')
    }, [isLoggedIn])

    const loginUser = async (e) => {
        e.preventDefault()
        setValidationErrors(null)
        setLoading(true)
        try {
            const data = await loginUserApi(user)
            dispatch(setCredentials({user: data.user, token: data.access_token}))
            toast.success(data.message)
            navigate('/')
        } catch (error) {
            if(error?.response?.status === 422) {
                setValidationErrors(error.response.data.errors)
            }
            console.log(error)
        }finally {
            setLoading(false)
        }
    }

    return (
        <div className="row my-5">
            <div className="col-md-6 mx-auto">
                <div className="card border-dark border border-2 shadow rounded-0">
                    <div className="card-header border-dark border-2 bg-white text-center mt-2">
                        <h4>
                            Login
                        </h4>
                    </div>
                    <div className="card-body">
                        <form onSubmit={(e) => loginUser(e)}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label fw-bold">Email address*</label>
                                <input 
                                    type="email" 
                                    className="form-control p-2 border border-dark border-3 rounded-0" 
                                    id="email" 
                                    value={user.email}
                                    onChange={(e) => setUser({
                                        ...user, email: e.target.value
                                    })}
                                />
                                { useValidation(validationErrors, 'email')}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label fw-bold">Password*</label>
                                <input 
                                    type="password" 
                                    className="form-control p-2 border border-dark border-3 rounded-0" 
                                    id="password" 
                                    value={user.password}
                                    onChange={(e) => setUser({
                                        ...user, password: e.target.value
                                    })}
                                />
                                { useValidation(validationErrors, 'password')}
                            </div>
                            {
                                loading ?
                                    <Spinner />
                                :
                                    <button type="submit" className="btn btn-dark">Submit</button>                          
                            }
                        </form>
                    </div>
                    <div className="card-footer border-dark border-2 bg-white text-center mt-2">
                        <span className="fw-bold me-1">
                            New user create your account from
                        </span>
                        <NavLink to="/register" className="text-dark fw-bold">
                            here
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    )
}

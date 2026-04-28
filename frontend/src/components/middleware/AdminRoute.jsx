import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

export default function AdminRoute({ children }) {
    const { isLoggedIn, user } = useSelector(state => state.user) 

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />
    }

    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />
    }

    return children
}

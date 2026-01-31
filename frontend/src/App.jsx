import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from "react-router"
import { useSelector } from 'react-redux'
import PrivateRoute from './components/middleware/PrivateRoute'
import Navbar from './components/layouts/Navbar'
const Home = lazy(() => import('./pages/Home'))
const Register = lazy(() => import('./pages/auth/Register'))
const Login = lazy(() => import('./pages/auth/Login'))
const Success = lazy(() => import('./pages/payments/Success'))
const PaymentPage = lazy(() => import('./pages/payments/PaymentPage'))
const PaymentTest = lazy(() => import('./pages/payments/PaymentTest'))
const Profile = lazy(() => import('./pages/user/Profile'))

export default function App() {
    const { isLoggedIn } = useSelector(state => state.user) 

    return (
        <BrowserRouter>
            { isLoggedIn && <Navbar />}
            <Suspense fallback={null} >
                <Routes>
                    <Route path="/" element={
                        <PrivateRoute>
                            <Home />
                        </PrivateRoute>
                    } />
                    <Route path="/pay/success" element={<Success />} />
                    <Route path="/pay/test/:reservationId" element={
                        <PrivateRoute>
                            <PaymentTest />
                        </PrivateRoute>
                    } />
                    <Route path="/pay/:reservationId" element={
                        <PrivateRoute>
                            <PaymentPage />
                        </PrivateRoute>
                    } />
                    <Route path="/profile" element={
                        <PrivateRoute>
                            <Profile />
                        </PrivateRoute>
                    } />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}

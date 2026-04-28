import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router"
import { useSelector } from 'react-redux'
import PrivateRoute from './components/middleware/PrivateRoute'
import AdminRoute from './components/middleware/AdminRoute'
import Navbar from './components/layouts/Navbar'
import AdminLayout from './components/layouts/AdminLayout'
import ChatBot from './components/ChatBot'

const Home            = lazy(() => import('./pages/Home'))
const Register        = lazy(() => import('./pages/auth/Register'))
const Login           = lazy(() => import('./pages/auth/Login'))
const AdminLogin      = lazy(() => import('./pages/auth/AdminLogin'))
const Success         = lazy(() => import('./pages/payments/Success'))
const PaymentPage     = lazy(() => import('./pages/payments/PaymentPage'))
const PaymentTestPage = lazy(() => import('./pages/payments/PaymentTestPage'))
const Profile         = lazy(() => import('./pages/user/Profile'))
const QRCodePage      = lazy(() => import('./pages/user/QRCodePage'))
const AdminDashboard  = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminUsers      = lazy(() => import('./pages/admin/AdminUsers'))
const AdminPlaces     = lazy(() => import('./pages/admin/AdminPlaces'))
const AdminSectors    = lazy(() => import('./pages/admin/AdminSectors'))
const AdminReservations = lazy(() => import('./pages/admin/AdminReservations'))
const AdminTasks      = lazy(() => import('./pages/admin/AdminTasks'))
const QRScanner       = lazy(() => import('./pages/admin/QRScanner'))
const StatisticsPage = lazy(() => import('./pages/admin/StatisticsPage'))

// Wraps a page with the user-facing navbar + content area
function UserPage({ children }) {
    return (
        <div className="user-layout">
            <Navbar />
            <div className="user-content">{children}</div>
        </div>
    )
}

// Wraps an admin page with the sidebar layout (no user Navbar)
function AdminPage({ children }) {
    return (
        <AdminRoute>
            <AdminLayout>{children}</AdminLayout>
        </AdminRoute>
    )
}

export default function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={null}>
                <Routes>
                    {/* ── Auth (no layout) ──────────────────── */}
                    <Route path="/login"    element={<Login />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/pay/success" element={
                        <PrivateRoute>
                            <UserPage><Success /></UserPage>
                        </PrivateRoute>
                    } />

                    {/* ── User pages ────────────────────────── */}
                    <Route path="/" element={
                        <PrivateRoute>
                            <UserPage><Home /></UserPage>
                        </PrivateRoute>
                    } />
                    <Route path="/profile" element={
                        <PrivateRoute>
                            <UserPage><Profile /></UserPage>
                        </PrivateRoute>
                    } />
                    <Route path="/qrcode/:reservationId" element={
                        <PrivateRoute>
                            <UserPage><QRCodePage /></UserPage>
                        </PrivateRoute>
                    } />
                    <Route path="/pay/test/:reservationId" element={
                        <PrivateRoute>
                            <UserPage><PaymentTestPage /></UserPage>
                        </PrivateRoute>
                    } />
                    <Route path="/pay/:reservationId" element={
                        <PrivateRoute>
                            <UserPage><PaymentPage /></UserPage>
                        </PrivateRoute>
                    } />

                    {/* ── Admin pages (sidebar layout) ──────── */}
                    <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="/admin/dashboard"    element={<AdminPage><AdminDashboard /></AdminPage>} />
                    <Route path="/admin/qr-scanner"   element={<AdminPage><QRScanner /></AdminPage>} />
                    <Route path="/admin/users"        element={<AdminPage><AdminUsers /></AdminPage>} />
                    <Route path="/admin/places"       element={<AdminPage><AdminPlaces /></AdminPage>} />
                    <Route path="/admin/sectors"      element={<AdminPage><AdminSectors /></AdminPage>} />
                    <Route path="/admin/reservations" element={<AdminPage><AdminReservations /></AdminPage>} />
                    <Route path="/admin/tasks"        element={<AdminPage><AdminTasks /></AdminPage>} />
                    <Route path="/admin/statistics"   element={<AdminPage><StatisticsPage /></AdminPage>} />
                </Routes>
                <ChatBot />
            </Suspense>
        </BrowserRouter>
    )
}


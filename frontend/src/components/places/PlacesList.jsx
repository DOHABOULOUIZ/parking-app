import React, { useEffect, useState, useCallback } from 'react'
import PlaceListItem from './PlaceListItem'
import { fetchPlacesApi } from '../../config/api'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import Pusher from 'pusher-js'
import Echo from 'laravel-echo'

const PER_PAGE = 6

export default function PlacesList() {
    const [places, setPlaces]     = useState([])
    const [loading, setLoading]   = useState(false)
    const [page, setPage]         = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [total, setTotal]       = useState(0)
    const { token } = useSelector(state => state.user)

    const updatePlaceInList = useCallback((updatedPlace) => {
        setPlaces(prev => prev.map(p => p.id === updatedPlace.id ? updatedPlace : p))
    }, [])

    const loadPlaces = useCallback(async (targetPage = 1) => {
        setLoading(true)
        try {
            const data = await fetchPlacesApi(token, targetPage, PER_PAGE)
            // Laravel ResourceCollection paginée : métadonnées dans data.meta
            const meta = data.meta ?? data
            setPlaces(data.data ?? [])
            setPage(meta.current_page ?? targetPage)
            setLastPage(meta.last_page ?? 1)
            setTotal(meta.total ?? 0)
        } catch {
            toast.error('Impossible de charger les places')
        } finally {
            setLoading(false)
        }
    }, [token])

    useEffect(() => {
        loadPlaces(1)

        if (!token) return

        window.Pusher = Pusher
        const echo = new Echo({
            broadcaster:  'pusher',
            key:          'zkn74klwnhkjynekovik',
            wsHost:       'localhost',
            wsPort:       8080,
            cluster:      'mt1',
            forceTLS:     false,
            encrypted:    false,
            disableStats: true,
            authEndpoint: 'http://127.0.0.1:8000/api/broadcasting/auth',
            auth: { headers: { Authorization: `Bearer ${token}` } },
        })

        const channel = echo.private('places')
        channel
            .listen('.placeCreated', () => loadPlaces(page))
            .listen('.placeUpdated', ({ place }) => updatePlaceInList(place))

        return () => echo.disconnect()
    }, [token]) // eslint-disable-line react-hooks/exhaustive-deps

    const goToPage = (p) => {
        if (p < 1 || p > lastPage || p === page || loading) return
        loadPlaces(p)
        const section = document.querySelector('.home-body')
        if (section) window.scrollTo({ top: section.offsetTop - 80, behavior: 'smooth' })
    }

    /* Smart ellipsis page list */
    const pageNumbers = () => {
        if (lastPage <= 7) return Array.from({ length: lastPage }, (_, i) => i + 1)
        if (page <= 4)           return [1, 2, 3, 4, 5, '…', lastPage]
        if (page >= lastPage - 3) return [1, '…', lastPage-4, lastPage-3, lastPage-2, lastPage-1, lastPage]
        return [1, '…', page - 1, page, page + 1, '…', lastPage]
    }

    const availableCount = places.filter(p => p.status === 'available').length

    return (
        <div>
            {/* Section header */}
            <div className="section-header">
                <div className="section-header__left">
                    <h2>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <path d="M9 3v18"/>
                            <path d="M14 8h1a3 3 0 0 1 0 6h-1"/>
                        </svg>
                        Places de Parking
                    </h2>
                    <p>Sélectionnez une place et réservez-la instantanément</p>
                </div>

                {(places.length > 0 || total > 0) && (
                    <div className="section-header__right">
                        <span className="section-badge">
                            <span className="section-badge__dot" />
                            {availableCount} disponible{availableCount !== 1 ? 's' : ''}
                        </span>
                        {total > 0 && (
                            <span className="section-total">
                                {total} place{total !== 1 ? 's' : ''} au total
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Grid */}
            <div className="places-grid">
                {loading && places.length === 0 ? (
                    <div className="places-loading">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="spin">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                        </svg>
                        Chargement des places…
                    </div>
                ) : places.length === 0 ? (
                    <div className="places-empty">
                        <div className="places-empty__icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2"/>
                                <path d="M9 3v18M15 9h1a2 2 0 0 1 0 4h-1v3"/>
                            </svg>
                        </div>
                        <h3>Aucune place disponible</h3>
                        <p>Revenez plus tard ou consultez une autre page</p>
                    </div>
                ) : (
                    <PlaceListItem
                        places={places}
                        updatePlaceInList={updatePlaceInList}
                    />
                )}
            </div>

            {/* Pagination */}
            {lastPage > 1 && (
                <div className="pagination">
                    <button
                        className="pagination__btn pagination__btn--nav"
                        onClick={() => goToPage(page - 1)}
                        disabled={page === 1 || loading}
                        aria-label="Page précédente"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6"/>
                        </svg>
                    </button>

                    {pageNumbers().map((p, i) =>
                        p === '…' ? (
                            <span key={`e-${i}`} className="pagination__ellipsis">…</span>
                        ) : (
                            <button
                                key={p}
                                className={`pagination__btn${p === page ? ' pagination__btn--active' : ''}`}
                                onClick={() => goToPage(p)}
                                disabled={loading}
                                aria-current={p === page ? 'page' : undefined}
                            >
                                {p}
                            </button>
                        )
                    )}

                    <button
                        className="pagination__btn pagination__btn--nav"
                        onClick={() => goToPage(page + 1)}
                        disabled={page === lastPage || loading}
                        aria-label="Page suivante"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"/>
                        </svg>
                    </button>
                </div>
            )}
        </div>
    )
}

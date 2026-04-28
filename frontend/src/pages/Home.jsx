import React from 'react'
import PlacesList from '../components/places/PlacesList'
import './home.css'

export default function Home() {
    return (
        <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 64px)' }}>

            {/* ── Hero ── */}
            <div className="hero">
                <div className="hero__inner">
                    <div className="hero__badge">
                        <span className="hero__badge-dot" />
                        Système de Stationnement Intelligent
                    </div>

                    <h1 className="hero__title">
                        Réservez votre place<br />
                        <span>en quelques secondes</span>
                    </h1>

                    <p className="hero__subtitle">
                        ParkApp vous permet de trouver et réserver instantanément
                        une place de parking. Simple, rapide et sécurisé.
                    </p>

                    <div className="hero__stats">
                        <div className="hero__stat">
                            <div className="hero__stat-value">24/7</div>
                            <div className="hero__stat-label">Disponible</div>
                        </div>
                        <div className="hero__stat">
                            <div className="hero__stat-value">&lt; 30s</div>
                            <div className="hero__stat-label">Réservation</div>
                        </div>
                        <div className="hero__stat">
                            <div className="hero__stat-value">100%</div>
                            <div className="hero__stat-label">Sécurisé</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Places ── */}
            <div className="home-body">
                <PlacesList />
            </div>

        </div>
    )
}

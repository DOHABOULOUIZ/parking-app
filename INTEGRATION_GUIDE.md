// INTÉGRATION DU NOUVEAU DASHBOARD ANALYTICS
// File: frontend/src/pages/admin/AdminDashboard.jsx

import React from 'react';
import AnalyticsDashboard from '../../components/AnalyticsDashboard';

/**
 * Page principale du tableau de bord administrateur
 * Affiche le nouveau dashboard analytics amélioré
 */
export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation/Header (si nécessaire) */}
      <header className="bg-white shadow sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-full">
        <AnalyticsDashboard />
      </main>

      {/* Footer (optionnel) */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <p className="text-sm text-gray-600">
            © 2026 Smart Parking Management - Dashboard Analytics v2.0
          </p>
        </div>
      </footer>
    </div>
  );
}

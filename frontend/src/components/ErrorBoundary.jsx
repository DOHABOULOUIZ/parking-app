import React from 'react';

/**
 * Error Boundary Component
 * Attrape les erreurs dans les composants enfants
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 p-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-red-500">
              <h1 className="text-3xl font-bold text-red-700 mb-4">⚠️ Erreur d'Affichage</h1>
              <p className="text-gray-700 mb-4">
                Une erreur s'est produite lors du chargement du dashboard analytics.
              </p>
              <div className="bg-red-100 border border-red-300 rounded p-4 mb-4">
                <p className="font-mono text-sm text-red-800">
                  {this.state.error?.message || 'Erreur inconnue'}
                </p>
              </div>
              <div className="space-y-2 mb-4">
                <h2 className="font-bold text-gray-900">Solutions possibles:</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Recharger la page (F5)</li>
                  <li>Vider le cache (Ctrl+Shift+Suppr)</li>
                  <li>Vérifier la connexion au serveur API</li>
                  <li>Vérifier la console du navigateur</li>
                </ul>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                🔄 Recharger la page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

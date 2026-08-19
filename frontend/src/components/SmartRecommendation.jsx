import { useState } from 'react';
import axios from 'axios';
import { MapPin, Clock, TrendingUp, DollarSign } from 'lucide-react';
import Button from '../custom/Button';
import { API_BASE_URL } from '../config/api';

export default function SmartRecommendation() {
  const [datetime, setDatetime] = useState('');
  const [duration, setDuration] = useState(2);
  const [recommendation, setRecommendation] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const getRecommendation = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${API_BASE_URL}/predictions/recommend-sector`,
        { datetime, duration_hours: duration },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setRecommendation(response.data);
    } catch (error) {
      console.error('Error getting recommendation:', error);
    } finally {
      setLoading(false);
    }
  };

  const predictAvailability = async (sectorId) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${API_BASE_URL}/predictions/availability`,
        { sector_id: sectorId, datetime },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error('Error predicting availability:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Recommandation Intelligente</h2>
      
      {/* Input Form */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date et heure d'arrivée
          </label>
          <input
            type="datetime-local"
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Durée prévue (heures)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(parseFloat(e.target.value))}
            min="0.5"
            step="0.5"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <Button
          onClick={getRecommendation}
          disabled={!datetime || loading}
          variant="primary"
          size="md"
          className="w-full"
        >
          {loading ? 'Analyse en cours...' : 'Obtenir une recommandation'}
        </Button>
      </div>

      {/* Recommendation Result */}
      {recommendation && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-blue-900">
                Meilleur choix: {recommendation.sector?.name}
              </h3>
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Recommandé
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-600">Places disponibles</p>
                  <p className="font-bold">{recommendation.available_places || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-xs text-gray-600">Prix estimé</p>
                  <p className="font-bold">{recommendation.estimated_price?.toFixed(2)} €</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-xs text-gray-600">Taux d'occupation</p>
                  <p className="font-bold">{recommendation.predicted_occupancy?.toFixed(0)}%</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-xs text-gray-600">Durée</p>
                  <p className="font-bold">{duration}h</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded p-3 mt-4">
              <p className="text-sm">
                <strong>Pourquoi ce secteur ?</strong> {recommendation.reason}
              </p>
            </div>
          </div>

          {/* Alternative Sectors */}
          {recommendation.alternatives && recommendation.alternatives.length > 0 && (
            <div>
              <h4 className="font-bold mb-3">Autres options:</h4>
              <div className="space-y-2">
                {recommendation.alternatives.map((alt, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => predictAvailability(alt.sector_id)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{alt.name}</span>
                      <span className="text-sm text-gray-600">
                        {alt.price?.toFixed(2)} € | {alt.occupancy?.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

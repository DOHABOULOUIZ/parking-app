import { useState } from 'react';
import { createApiClient } from '../config/api';

/**
 * DIAGNOSTIC COMPONENT - Test API endpoints
 * Remove this component after debugging!
 */
export default function AnalyticsDiagnostic() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (name, url, params = {}) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setResults(prev => ({
          ...prev,
          [name]: { status: '❌ ERROR', message: 'No token found' }
        }));
        return;
      }

      const apiClient = createApiClient(token);
      const response = await apiClient.get(url, { params });
      
      setResults(prev => ({
        ...prev,
        [name]: {
          status: '✅ SUCCESS',
          data: response.data,
          statusCode: response.status
        }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [name]: {
          status: '❌ ERROR',
          message: error.response?.data?.message || error.message,
          statusCode: error.response?.status
        }
      }));
    }
  };

  const runTests = async () => {
    setLoading(true);
    setResults({});

    await testEndpoint('Dashboard', '/admin/analytics/dashboard', { period: 'week' });
    await testEndpoint('Occupancy Trend', '/admin/analytics/occupancy-trend', { days: 7 });
    await testEndpoint('Revenue Trend', '/admin/analytics/revenue-trend', { days: 7 });
    await testEndpoint('Cancellation Trend', '/admin/analytics/cancellation-trend', { days: 7 });
    await testEndpoint('Sector Comparison', '/admin/analytics/sector-comparison');
    await testEndpoint('Top Users', '/admin/analytics/top-users', { period: 'week' });
    await testEndpoint('Duration Distribution', '/admin/analytics/duration-distribution', { period: 'week' });
    await testEndpoint('Hourly Occupancy', '/admin/analytics/hourly-occupancy', { period: 'week' });

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🔧 API Diagnostic Tool</h1>
        <p className="text-gray-600 mb-6">Test all analytics endpoints</p>

        <button
          onClick={runTests}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 mb-8"
        >
          {loading ? 'Testing...' : 'Run Diagnostic Tests'}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(results).map(([name, result]) => (
            <div key={name} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">{name}</h3>
              <p className={`text-sm mb-3 ${result.status.includes('SUCCESS') ? 'text-green-600' : 'text-red-600'}`}>
                {result.status}
              </p>
              {result.statusCode && (
                <p className="text-xs text-gray-500 mb-2">Status Code: {result.statusCode}</p>
              )}
              <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-64">
                {JSON.stringify(result.data || result.message, null, 2)}
              </pre>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-900 mb-2">📋 Debug Checklist:</h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>✓ Check if all endpoints return green ✅</li>
            <li>✓ If 401/403: Token is invalid or expired</li>
            <li>✓ If empty data []: Database might have no analytics data</li>
            <li>✓ Run artisan seeder if no test data exists</li>
            <li>✓ Delete this component after debugging!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

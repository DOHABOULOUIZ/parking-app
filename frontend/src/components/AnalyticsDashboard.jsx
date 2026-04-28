import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { toast } from 'react-toastify';
import { createApiClient } from '../config/api';
import './AnalyticsDashboard.css';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const getPeriodDays = (period) => ({ day: 1, week: 7, month: 30, year: 365 }[period] || 7);

const fmt = (value, decimals = 2) => {
  const num = parseFloat(value);
  return isNaN(num) ? '0' : num.toFixed(decimals);
};

function KPICard({ title, value, sub, variant = 'blue', icon }) {
  return (
    <div className={`kpi-card kpi-card--${variant}`}>
      <div className="kpi-card__icon">{icon}</div>
      <p className="kpi-card__title">{title}</p>
      <h3 className="kpi-card__value">{value}</h3>
      {sub && <p className="kpi-card__sub">{sub}</p>}
    </div>
  );
}

function StatsCard({ stats }) {
  return (
    <div className="kpi-card kpi-card--blue">
      <div className="kpi-card__icon">👥</div>
      <p className="kpi-card__title">Utilisateurs</p>
      <div className="stats-breakdown">
        <div className="stats-breakdown__row">
          <span className="stats-breakdown__label">Total</span>
          <span className="stats-breakdown__value">{stats?.total_users ?? 0}</span>
        </div>
        <div className="stats-breakdown__row">
          <span className="stats-breakdown__label">Actifs</span>
          <span className="stats-breakdown__value stats-breakdown__value--green">{stats?.active_users ?? 0}</span>
        </div>
        <div className="stats-breakdown__row">
          <span className="stats-breakdown__label">Nouveaux</span>
          <span className="stats-breakdown__value stats-breakdown__value--blue">{stats?.new_users ?? 0}</span>
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <h3>{title}</h3>
      </div>
      <div className="chart-card__body">{children}</div>
    </div>
  );
}

export default function AnalyticsDashboard() {
  const { token } = useSelector(state => state.user);
  const [period, setPeriod] = useState('week');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);

  const [analytics, setAnalytics] = useState({});
  const [occupancyTrend, setOccupancyTrend] = useState([]);
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [cancellationTrend, setCancellationTrend] = useState([]);
  const [sectorComparison, setSectorComparison] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [durationDist, setDurationDist] = useState([]);
  const [hourlyOccupancy, setHourlyOccupancy] = useState([]);

  const fetchAnalytics = useCallback(async () => {
    if (!token) {
      setError('Authentification requise. Veuillez vous connecter.');
      setLoading(false);
      return;
    }

    try {
      setError(null);
      setLoading(true);

      const api = createApiClient(token);
      const days = getPeriodDays(period);
      const params = { period, days };

      const endpoints = [
        { url: '/admin/analytics/dashboard',           setter: setAnalytics,          key: null },
        { url: '/admin/analytics/occupancy-trend',     setter: setOccupancyTrend,     key: 'trend' },
        { url: '/admin/analytics/revenue-trend',       setter: setRevenueTrend,        key: 'trend' },
        { url: '/admin/analytics/cancellation-trend',  setter: setCancellationTrend,   key: 'trend' },
        { url: '/admin/analytics/sector-comparison',   setter: setSectorComparison,    key: 'comparison' },
        { url: '/admin/analytics/top-users',           setter: setTopUsers,            key: 'top_users' },
        { url: '/admin/analytics/duration-distribution', setter: setDurationDist,      key: 'distribution' },
        { url: '/admin/analytics/hourly-occupancy',    setter: setHourlyOccupancy,     key: 'hourly' },
      ];

      await Promise.all(
        endpoints.map(ep =>
          api.get(ep.url, { params })
            .then(res => {
              const raw = ep.key ? (res.data[ep.key] ?? res.data) : res.data;
              ep.setter(Array.isArray(raw) ? raw : (raw ?? (ep.key ? [] : {})));
            })
            .catch(err => {
              console.error(`Error ${ep.url}:`, err.response?.data || err.message);
              ep.setter(ep.key ? [] : {});
            })
        )
      );
    } catch (err) {
      console.error('Analytics error:', err);
      setError('Erreur lors du chargement des données analytics');
    } finally {
      setLoading(false);
    }
  }, [period, token]);

  useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

  const handleExportReport = async (format) => {
    if (!token) { toast.error('Authentification requise'); return; }
    try {
      setExportLoading(true);
      const api = createApiClient(token);
      const response = await api.post(
        '/admin/analytics/export-report',
        {
          start_date: startDate || new Date(Date.now() - getPeriodDays(period) * 86400000).toISOString().split('T')[0],
          end_date:   endDate   || new Date().toISOString().split('T')[0],
          format,
        },
        { responseType: format === 'json' ? 'json' : format === 'excel' ? 'arraybuffer' : 'blob' }
      );
      if (format !== 'json') {
        const isExcel = format === 'excel';
        const ext     = isExcel ? 'xlsx' : 'csv';
        const mime    = isExcel
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'text/csv;charset=utf-8;';
        const blob = new Blob([response.data], { type: mime });
        const url  = window.URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href = url;
        a.setAttribute('download', `rapport_analytics.${ext}`);
        document.body.appendChild(a);
        a.click();
        a.parentElement.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
      toast.success(`Rapport exporté avec succès`);
    } catch {
      toast.error("Erreur lors de l'export");
    } finally {
      setExportLoading(false);
    }
  };

  // Chart data transforms
  const occupancyData    = occupancyTrend.map(i => ({ date: i.date, taux: parseFloat(i.rate ?? i.occupancy_rate ?? 0) }));
  const revenueData      = revenueTrend.map(i => ({ date: i.date, revenus: parseFloat(i.revenue ?? 0) }));
  const cancellationData = cancellationTrend.map(i => ({ date: i.date, taux: parseFloat(i.rate ?? 0) }));
  const sectorData       = sectorComparison.map(i => ({ name: i.name ?? i.sector_name ?? 'N/A', value: parseInt(i.total_reservations ?? i.reservations_count ?? 0) }));
  const durationData     = durationDist.map(i => ({ name: i.range ?? 'N/A', value: i.count ?? 0 }));
  const hourlyData       = hourlyOccupancy.map(i => ({ hour: i.hour ?? 'N/A', occupancy: parseFloat(i.occupancy ?? 0) }));

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p className="loading-text">Chargement des statistiques...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-card">
          <h2 className="error-card__title">Erreur</h2>
          <p className="error-card__message">{error}</p>
          <button onClick={fetchAnalytics} className="error-btn">Réessayer</button>
        </div>
      </div>
    );
  }

  const userStats = analytics.user_statistics ?? {};

  return (
    <div className="analytics-container">

      {/* ── Header ── */}
      <header className="analytics-header">
        <div className="analytics-header__logo">
          <img src="/logo.png" alt="ParkApp" />
        </div>
        <div>
          <h1 className="analytics-header__title">Tableau de Bord Analytics</h1>
          <p className="analytics-header__subtitle">Statistiques et tendances en temps réel de votre parking</p>
        </div>
      </header>

      {/* ── Filters ── */}
      <section className="filters-card">
        <div className="filters-grid">
          <div className="filter-group">
            <label>Période</label>
            <select value={period} onChange={e => setPeriod(e.target.value)}>
              <option value="day">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="year">Cette année</option>
            </select>
          </div>
          <div className="filter-group">
            <label>De</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div className="filter-group">
            <label>À</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
          <div className="filter-group">
            <button onClick={fetchAnalytics} className="filter-btn">Appliquer</button>
          </div>
        </div>
      </section>

      {/* ── Export ── */}
      <section className="export-card">
        <div>
          <h3 className="export-card__title">Exporter les rapports</h3>
          <p className="export-card__desc">Téléchargez les données analytiques au format de votre choix</p>
        </div>
        <div className="export-actions">
          <button onClick={() => handleExportReport('excel')} disabled={exportLoading} className="btn-export btn-export--primary">
            {exportLoading ? '⏳ Export...' : '📊 Excel'}
          </button>
          <button onClick={() => handleExportReport('csv')} disabled={exportLoading} className="btn-export btn-export--secondary">
            {exportLoading ? '⏳ Export...' : '📋 CSV'}
          </button>
        </div>
      </section>

      {/* ── KPI Cards (2 rows × 4) ── */}
      <section className="kpi-grid">
        {/* Row 1 */}
        <KPICard
          title="Taux d'Occupation"
          value={`${fmt(analytics.occupancy_rate ?? 0)}%`}
          sub="Places occupées"
          variant="blue"
          icon="📊"
        />
        <KPICard
          title="Revenus"
          value={`${fmt(analytics.revenue ?? 0)} MAD`}
          sub="Période sélectionnée"
          variant="green"
          icon="💰"
        />
        <KPICard
          title="Durée Moyenne"
          value={`${fmt(analytics.average_duration ?? 0)}h`}
          sub="Par stationnement"
          variant="amber"
          icon="⏱️"
        />
        <KPICard
          title="Utilisations Actives"
          value={userStats.active_users ?? 0}
          sub="Utilisateurs actifs"
          variant="violet"
          icon="⚡"
        />

        {/* Row 2 */}
        <KPICard
          title="Taux d'Annulation"
          value={`${fmt(analytics.cancellation_rate ?? 0)}%`}
          sub="Réservations annulées"
          variant="rose"
          icon="❌"
        />
        <KPICard
          title="Revenu par Rés."
          value={`${fmt(analytics.average_revenue_per_reservation ?? 0)} MAD`}
          sub="Moyenne par réservation"
          variant="green"
          icon="📈"
        />
        <KPICard
          title="No-Shows"
          value={`${fmt(analytics.no_show_rate ?? 0)}%`}
          sub="Absences enregistrées"
          variant="amber"
          icon="🚫"
        />
        <StatsCard stats={userStats} />
      </section>

      {/* ── Charts (2 columns) ── */}
      <section className="charts-grid">
        <ChartCard title="📈 Taux d'occupation">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={occupancyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="taux" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="💰 Revenus">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="revenus" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="❌ Taux d'annulation">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={cancellationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="taux" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="🏢 Distribution par Secteur">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={sectorData}
                cx="50%" cy="50%"
                outerRadius={90}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {sectorData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="⏱️ Distribution de durée">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={durationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="🕐 Occupation horaire">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="occupancy" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      {/* ── Top Users Table ── */}
      <section className="table-card">
        <div className="table-card__header">
          <h3>👥 Utilisateurs principaux</h3>
        </div>
        <div className="table-card__body">
          <table className="table-modern">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Email</th>
                <th className="cell-center">Réservations</th>
                <th className="cell-right">Montant Total</th>
              </tr>
            </thead>
            <tbody>
              {topUsers.length > 0 ? topUsers.map((user, i) => (
                <tr key={i}>
                  <td>
                    <div className="user-cell">
                      <span className="user-cell__avatar">{(user.name || 'U')[0].toUpperCase()}</span>
                      <span className="cell-name">{user.name || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="cell-email">{user.email || 'N/A'}</td>
                  <td className="cell-center">{user.total_reservations ?? user.reservations_count ?? 0}</td>
                  <td className="cell-amount cell-right">{fmt(user.total_spent ?? user.total_amount ?? 0)} MAD</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="table-empty">Aucune donnée disponible</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
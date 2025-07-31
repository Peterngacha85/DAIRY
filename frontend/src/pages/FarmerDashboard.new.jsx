import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import api from '../services/api';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    todayMilk: 0,
    weeklyMilk: 0,
    pendingHealth: 0,
    feedStock: 0,
    recentMilk: [],
    recentHealth: [],
    recentFeeds: [],
    breeds: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [milkRes, healthRes, feedsRes, breedsRes] = await Promise.all([
          api.get('/milk'),
          api.get('/health'),
          api.get('/feeds'),
          api.get('/breeds')
        ]);

        // Calculate today's milk production
        const today = new Date().toISOString().split('T')[0];
        const todayMilk = milkRes.data
          .filter(record => record.date.startsWith(today))
          .reduce((sum, record) => sum + record.quantity, 0);

        // Calculate weekly milk production
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weeklyMilk = milkRes.data
          .filter(record => new Date(record.date) >= weekAgo)
          .reduce((sum, record) => sum + record.quantity, 0);

        setDashboardData({
          todayMilk,
          weeklyMilk,
          pendingHealth: healthRes.data.filter(record => record.status === 'pending').length,
          feedStock: feedsRes.data.reduce((sum, feed) => sum + feed.quantity, 0),
          recentMilk: milkRes.data.slice(-5),
          recentHealth: healthRes.data.slice(-5),
          recentFeeds: feedsRes.data.slice(-5),
          breeds: breedsRes.data
        });
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {error && (
        <div className="error-banner">
          <p>{error}</p>
        </div>
      )}

      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome, {user?.name}</h1>
        <div className="action-buttons">
          <Link to="/milk/add" className="primary-button">
            Record Milk Production
          </Link>
          <Link to="/breeds/new" className="primary-button">
            Add New Breed
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-content">
            <div>
              <h2>Today's Production</h2>
              <p className="stat-value">{dashboardData.todayMilk} L</p>
            </div>
            <span className="stat-badge blue">Today</span>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-content">
            <div>
              <h2>Weekly Production</h2>
              <p className="stat-value">{dashboardData.weeklyMilk} L</p>
            </div>
            <span className="stat-badge green">This Week</span>
          </div>
        </div>

        <div className="stat-card yellow">
          <div className="stat-content">
            <div>
              <h2>Pending Health Checks</h2>
              <p className="stat-value">{dashboardData.pendingHealth}</p>
            </div>
            <span className="stat-badge yellow">Attention</span>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-content">
            <div>
              <h2>Feed Stock</h2>
              <p className="stat-value">{dashboardData.feedStock} kg</p>
            </div>
            <span className="stat-badge purple">Stock</span>
          </div>
        </div>
      </div>

      {/* Breeds Section */}
      <div className="section-container">
        <div className="section-header">
          <h2>Cattle Breeds</h2>
        </div>
        <div className="breeds-grid">
          {dashboardData.breeds.length === 0 ? (
            <p>No breeds added yet. Add your first breed to get started!</p>
          ) : (
            dashboardData.breeds.map((breed) => (
              <div key={breed._id} className="breed-card">
                <h3>{breed.breedName}</h3>
                {breed.origin && <p><strong>Origin:</strong> {breed.origin}</p>}
                {breed.avgMilkProduction > 0 && (
                  <p><strong>Avg. Milk Production:</strong> {breed.avgMilkProduction} L/day</p>
                )}
                {breed.avgWeight > 0 && (
                  <p><strong>Avg. Weight:</strong> {breed.avgWeight} kg</p>
                )}
                {breed.characteristics && (
                  <p><strong>Characteristics:</strong> {breed.characteristics}</p>
                )}
                {breed.description && <p>{breed.description}</p>}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="detail-grid">
        <div className="detail-card">
          <div className="card-header">
            <h2>Recent Milk Production</h2>
            <Link to="/milk" className="view-all">View All</Link>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentMilk.map((record) => (
                  <tr key={record._id}>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>{record.quantity} L</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="detail-card">
          <div className="card-header">
            <h2>Recent Health Records</h2>
            <Link to="/health" className="view-all">View All</Link>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Issue</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentHealth.map((record) => (
                  <tr key={record._id}>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>{record.issue}</td>
                    <td>
                      <span className={`status-badge ${record.status}`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <div className="card-header">
          <h2>Quick Actions</h2>
        </div>
        <div className="quick-actions-grid">
          <Link to="/milk/add" className="quick-action-card blue">
            <i className="icon-milk"></i>
            <span>Record Milk</span>
          </Link>
          
          <Link to="/health/new" className="quick-action-card red">
            <i className="icon-health"></i>
            <span>Add Health Record</span>
          </Link>

          <Link to="/feeds/new" className="quick-action-card green">
            <i className="icon-feed"></i>
            <span>Add Feed Stock</span>
          </Link>

          <Link to="/breeds/new" className="quick-action-card purple">
            <i className="icon-breed"></i>
            <span>Add New Breed</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

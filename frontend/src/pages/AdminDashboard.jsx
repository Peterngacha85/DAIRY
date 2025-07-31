import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import api from '../services/api';
import '../styles/dashboard.css';
import '../styles/admin-dashboard.css';
import { 
  FaHorse as FaCow,
  FaClipboardCheck as FaClipboardList, 
  FaBoxOpen as FaBoxes, 
  FaWineBottle as FaMilk 
} from 'react-icons/fa';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalFarmers: 0,
    totalMilk: 0,
    totalBreeds: 0,
    totalFeeds: 0,
    totalHealth: 0
  });
  const [breeds, setBreeds] = useState([]);
  const [healthRecords, setHealthRecords] = useState([]);
  const [feedStock, setFeedStock] = useState([]);
  const [milkRecords, setMilkRecords] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [dashboardRes, farmersRes, breedsRes, healthRes, feedsRes, milkRes] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/farmers'),
          api.get('/breeds'),
          api.get('/health'),
          api.get('/feeds'),
          api.get('/milk')
        ]);

        setStats(dashboardRes.data);
        setFarmers(farmersRes.data);
        setBreeds(breedsRes.data);
        setHealthRecords(healthRes.data);
        setFeedStock(feedsRes.data);
        setMilkRecords(milkRes.data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleBlockFarmer = async (farmerId) => {
    try {
      await api.patch(`/admin/farmers/${farmerId}/block`);
      // Refresh farmers list
      const res = await api.get('/admin/farmers');
      setFarmers(res.data);
    } catch (err) {
      setError('Failed to update farmer status');
      console.error(err);
    }
  };

  const handleDeleteFarmer = async (farmerId) => {
    if (!window.confirm('Are you sure you want to delete this farmer?')) return;
    
    try {
      await api.delete(`/admin/farmers/${farmerId}`);
      // Refresh farmers list
      const res = await api.get('/admin/farmers');
      setFarmers(res.data);
    } catch (err) {
      setError('Failed to delete farmer');
      console.error(err);
    }
  };

  const handleDeleteBreed = async (breedId) => {
    if (!window.confirm('Are you sure you want to delete this breed?')) return;
    try {
      await api.delete(`/breeds/${breedId}`);
      const res = await api.get('/breeds');
      setBreeds(res.data);
    } catch (err) {
      setError('Failed to delete breed');
      console.error(err);
    }
  };

  const handleUpdateHealthStatus = async (recordId) => {
    try {
      const newStatus = prompt('Enter new status (pending, in-progress, resolved):');
      if (!newStatus) return;
      
      await api.patch(`/health/${recordId}`, { status: newStatus.toLowerCase() });
      const res = await api.get('/health');
      setHealthRecords(res.data);
    } catch (err) {
      setError('Failed to update health record status');
      console.error(err);
    }
  };

  const handleDeleteFeed = async (feedId) => {
    if (!window.confirm('Are you sure you want to delete this feed stock?')) return;
    try {
      await api.delete(`/feeds/${feedId}`);
      const res = await api.get('/feeds');
      setFeedStock(res.data);
    } catch (err) {
      setError('Failed to delete feed stock');
      console.error(err);
    }
  };

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
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <div className="admin-actions">
          <button onClick={() => navigate('/breeds/manage')} className="admin-action-button">
            <FaCow /> Manage Breeds
          </button>
          <button onClick={() => navigate('/health/manage')} className="admin-action-button">
            <FaClipboardList /> Health Records
          </button>
          <button onClick={() => navigate('/feeds/manage')} className="admin-action-button">
            <FaBoxes /> Feed Stock
          </button>
          <button onClick={() => navigate('/milk/reports')} className="admin-action-button">
            <FaMilk /> Production Reports
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-button ${activeTab === 'farmers' ? 'active' : ''}`}
          onClick={() => setActiveTab('farmers')}
        >
          Farmers
        </button>
        <button
          className={`tab-button ${activeTab === 'breeds' ? 'active' : ''}`}
          onClick={() => setActiveTab('breeds')}
        >
          Breeds
        </button>
        <button
          className={`tab-button ${activeTab === 'health' ? 'active' : ''}`}
          onClick={() => setActiveTab('health')}
        >
          Health
        </button>
        <button
          className={`tab-button ${activeTab === 'feeds' ? 'active' : ''}`}
          onClick={() => setActiveTab('feeds')}
        >
          Feeds
        </button>
      </div>

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <>
          {/* Quick Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-content">
                <div>
                  <h2>Total Farmers</h2>
                  <p className="stat-value">{stats.totalFarmers}</p>
                </div>
                <span className="stat-badge blue">Farmers</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-content">
                <div>
                  <h2>Total Milk Production</h2>
                  <p className="stat-value">{stats.totalMilk.toFixed(1)} L</p>
                </div>
                <span className="stat-badge green">Production</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-content">
                <div>
                  <h2>Active Breeds</h2>
                  <p className="stat-value">{stats.totalBreeds}</p>
                </div>
                <span className="stat-badge purple">Breeds</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-content">
                <div>
                  <h2>Health Records</h2>
                  <p className="stat-value">{stats.totalHealth}</p>
                </div>
                <span className="stat-badge yellow">Health</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Farmers Tab Content */}
      {activeTab === 'farmers' && (
        <div className="section-container">
          <div className="section-header">
            <h2>Registered Farmers</h2>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Farm Name</th>
                  <th>Registration Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {farmers.map((farmer) => (
                  <tr key={farmer._id}>
                    <td>{farmer.name}</td>
                    <td>{farmer.email}</td>
                    <td>{farmer.farmName || '-'}</td>
                    <td>{new Date(farmer.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${farmer.isBlocked ? 'blocked' : 'active'}`}>
                        {farmer.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleBlockFarmer(farmer._id)}
                          className={`action-button ${farmer.isBlocked ? 'unblock' : 'block'}`}
                        >
                          {farmer.isBlocked ? 'Unblock' : 'Block'}
                        </button>
                        <button
                          onClick={() => handleDeleteFarmer(farmer._id)}
                          className="action-button delete"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => navigate(`/farmers/${farmer._id}/details`)}
                          className="action-button view"
                        >
                          View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Breeds Tab Content */}
      {activeTab === 'breeds' && (
        <div className="section-container">
          <div className="section-header">
            <h2>Manage Breeds</h2>
            <button onClick={() => navigate('/breeds/new')} className="primary-button">
              Add New Breed
            </button>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Breed Name</th>
                  <th>Origin</th>
                  <th>Avg. Milk Production</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {breeds.map((breed) => (
                  <tr key={breed._id}>
                    <td>{breed.name}</td>
                    <td>{breed.origin || '-'}</td>
                    <td>{breed.avgMilkProduction || '-'} L/day</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => navigate(`/breeds/${breed._id}/edit`)}
                          className="action-button edit"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBreed(breed._id)}
                          className="action-button delete"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Health Records Tab Content */}
      {activeTab === 'health' && (
        <div className="section-container">
          <div className="section-header">
            <h2>Health Records</h2>
            <div className="filter-buttons">
              <button className="filter-button active">All</button>
              <button className="filter-button">Pending</button>
              <button className="filter-button">In Progress</button>
              <button className="filter-button">Resolved</button>
            </div>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Farm</th>
                  <th>Animal ID</th>
                  <th>Issue</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {healthRecords.map((record) => (
                  <tr key={record._id}>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>{record.farmName}</td>
                    <td>{record.animalId}</td>
                    <td>{record.issue}</td>
                    <td>
                      <span className={`status-badge ${record.status}`}>
                        {record.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => navigate(`/health/${record._id}/details`)}
                          className="action-button view"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleUpdateHealthStatus(record._id)}
                          className="action-button edit"
                        >
                          Update Status
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Feed Stock Tab Content */}
      {activeTab === 'feeds' && (
        <div className="section-container">
          <div className="section-header">
            <h2>Feed Stock Management</h2>
            <button onClick={() => navigate('/feeds/new')} className="primary-button">
              Add New Feed Stock
            </button>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Feed Type</th>
                  <th>Quantity</th>
                  <th>Last Updated</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {feedStock.map((feed) => (
                  <tr key={feed._id}>
                    <td>{feed.type}</td>
                    <td>{feed.quantity} {feed.unit}</td>
                    <td>{new Date(feed.updatedAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${feed.quantity < 100 ? 'low' : 'good'}`}>
                        {feed.quantity < 100 ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => navigate(`/feeds/${feed._id}/update`)}
                          className="action-button edit"
                        >
                          Update Stock
                        </button>
                        <button
                          onClick={() => handleDeleteFeed(feed._id)}
                          className="action-button delete"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

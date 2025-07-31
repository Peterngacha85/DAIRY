import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../../styles/forms.css';

export default function AddHealthRecord() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    animalId: '',
    issue: '',
    treatment: '',
    date: new Date().toISOString().split('T')[0],
    status: 'pending',
    notes: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await api.post('/health', formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add health record');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="form-container">
      <h2 className="form-title">New Health Record</h2>
      
      {error && (
        <div className="error-banner">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="animalId" className="form-label required">
              Animal ID
            </label>
            <input
              type="text"
              id="animalId"
              name="animalId"
              required
              value={formData.animalId}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter animal ID"
            />
          </div>

          <div className="form-group">
            <label htmlFor="date" className="form-label required">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              required
              value={formData.date}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="status" className="form-label required">
              Status
            </label>
            <select
              id="status"
              name="status"
              required
              value={formData.status}
              onChange={handleChange}
              className="form-select"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="issue" className="form-label required">
            Health Issue
          </label>
          <input
            type="text"
            id="issue"
            name="issue"
            required
            value={formData.issue}
            onChange={handleChange}
            className="form-input"
            placeholder="Describe the health issue"
          />
        </div>

        <div className="form-group">
          <label htmlFor="treatment" className="form-label required">
            Treatment
          </label>
          <textarea
            id="treatment"
            name="treatment"
            required
            value={formData.treatment}
            onChange={handleChange}
            className="form-textarea"
            rows="3"
            placeholder="Describe the treatment given or planned"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="notes" className="form-label">
            Additional Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="form-textarea"
            rows="3"
            placeholder="Any additional observations or follow-up notes"
          ></textarea>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="secondary-button"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="primary-button"
          >
            {loading ? 'Saving...' : 'Save Record'}
          </button>
        </div>
      </form>
    </div>
  );
}

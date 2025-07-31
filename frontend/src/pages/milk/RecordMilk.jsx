import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../../styles/forms.css';

export default function AddMilkRecord() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    quantity: '',
    date: new Date().toISOString().split('T')[0],
    type: 'morning',
    notes: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await api.post('/milk', formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add milk record');
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
      <h2 className="form-title">Record Milk Production</h2>
      
      {error && (
        <div className="error-banner">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="quantity" className="form-label required">
              Quantity (Liters)
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              required
              step="0.1"
              min="0"
              value={formData.quantity}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter milk quantity"
            />
          </div>

          <div className="form-group">
            <label htmlFor="date" className="form-label required">
              Collection Date
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
            <label htmlFor="type" className="form-label required">
              Collection Time
            </label>
            <select
              id="type"
              name="type"
              required
              value={formData.type}
              onChange={handleChange}
              className="form-select"
            >
              <option value="morning">Morning</option>
              <option value="evening">Evening</option>
            </select>
            <p className="helper-text">Select when the milk was collected</p>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="notes" className="form-label">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="form-textarea"
            rows="3"
            placeholder="Any additional notes about this collection"
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
            {loading ? 'Recording...' : 'Record Production'}
          </button>
        </div>
      </form>
    </div>
  );
}

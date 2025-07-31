import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../../styles/forms.css';

export default function AddBreed() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    origin: '',
    characteristics: '',
    avgMilkProduction: '',
    avgWeight: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await api.post('/breeds', formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add breed');
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
      <h2 className="form-title">Add New Breed</h2>
      
      {error && (
        <div className="error-banner">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="name" className="form-label required">
              Breed Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter breed name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="origin" className="form-label">
              Origin
            </label>
            <input
              type="text"
              id="origin"
              name="origin"
              value={formData.origin}
              onChange={handleChange}
              className="form-input"
              placeholder="Country or region of origin"
            />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="avgMilkProduction" className="form-label">
              Average Milk Production (L/day)
            </label>
            <input
              type="number"
              id="avgMilkProduction"
              name="avgMilkProduction"
              min="0"
              step="0.1"
              value={formData.avgMilkProduction}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter average milk production"
            />
          </div>

          <div className="form-group">
            <label htmlFor="avgWeight" className="form-label">
              Average Weight (kg)
            </label>
            <input
              type="number"
              id="avgWeight"
              name="avgWeight"
              min="0"
              value={formData.avgWeight}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter average weight"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="characteristics" className="form-label">
            Characteristics
          </label>
          <textarea
            id="characteristics"
            name="characteristics"
            value={formData.characteristics}
            onChange={handleChange}
            className="form-textarea"
            rows="3"
            placeholder="Physical characteristics, temperament, etc."
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-textarea"
            rows="4"
            placeholder="General description and additional information"
          ></textarea>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="secondary-button"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="primary-button"
          >
            {loading ? 'Adding...' : 'Add Breed'}
          </button>
        </div>
      </form>
    </div>
  );
}

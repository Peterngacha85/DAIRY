import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../../styles/forms.css';

export default function AddFeed() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    unit: 'kg',
    type: 'roughage',
    purchaseDate: new Date().toISOString().split('T')[0],
    cost: '',
    supplier: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await api.post('/feeds', formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add feed');
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
      <h2 className="form-title">Add Feed Stock</h2>
      
      {error && (
        <div className="error-banner">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="name" className="form-label required">
              Feed Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter feed name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="type" className="form-label required">
              Feed Type
            </label>
            <select
              id="type"
              name="type"
              required
              value={formData.type}
              onChange={handleChange}
              className="form-select"
            >
              <option value="roughage">Roughage</option>
              <option value="concentrate">Concentrate</option>
              <option value="supplement">Supplement</option>
              <option value="mineral">Mineral Mix</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="quantity" className="form-label required">
              Quantity
            </label>
            <div className="form-input-group">
              <input
                type="number"
                id="quantity"
                name="quantity"
                required
                min="0"
                step="0.1"
                value={formData.quantity}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter quantity"
              />
              <select
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="form-select"
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="g">Grams (g)</option>
                <option value="ton">Tons</option>
                <option value="bale">Bales</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="cost" className="form-label required">
              Cost (₹)
            </label>
            <input
              type="number"
              id="cost"
              name="cost"
              required
              min="0"
              step="0.01"
              value={formData.cost}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter cost"
            />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="purchaseDate" className="form-label required">
              Purchase Date
            </label>
            <input
              type="date"
              id="purchaseDate"
              name="purchaseDate"
              required
              value={formData.purchaseDate}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="supplier" className="form-label">
              Supplier
            </label>
            <input
              type="text"
              id="supplier"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter supplier name"
            />
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
            placeholder="Any additional notes about this feed stock"
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
            {loading ? 'Adding...' : 'Add Feed Stock'}
          </button>
        </div>
      </form>
    </div>
  );
}

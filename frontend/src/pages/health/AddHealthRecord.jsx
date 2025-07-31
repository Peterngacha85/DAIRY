import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

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
      await api.post('/api/health', formData);
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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
        <h2 className="text-2xl font-bold mb-6">Add Health Record</h2>
        
        {error && (
          <div className="error-banner mb-4">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="animalId" className="block text-sm font-medium text-gray-700">
              Animal ID
            </label>
            <input
              type="text"
              id="animalId"
              name="animalId"
              required
              value={formData.animalId}
              onChange={handleChange}
              className="mt-1 form-input"
            />
          </div>

          <div>
            <label htmlFor="issue" className="block text-sm font-medium text-gray-700">
              Health Issue
            </label>
            <input
              type="text"
              id="issue"
              name="issue"
              required
              value={formData.issue}
              onChange={handleChange}
              className="mt-1 form-input"
            />
          </div>

          <div>
            <label htmlFor="treatment" className="block text-sm font-medium text-gray-700">
              Treatment Given
            </label>
            <input
              type="text"
              id="treatment"
              name="treatment"
              required
              value={formData.treatment}
              onChange={handleChange}
              className="mt-1 form-input"
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              required
              value={formData.date}
              onChange={handleChange}
              className="mt-1 form-input"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              name="status"
              required
              value={formData.status}
              onChange={handleChange}
              className="mt-1 form-select"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="mt-1 form-textarea"
              rows="3"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-4">
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
              {loading ? 'Adding...' : 'Add Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

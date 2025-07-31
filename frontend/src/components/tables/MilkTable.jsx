import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function MilkTable() {
  const [milk, setMilk] = useState([]);
  const [form, setForm] = useState({ quantity: '', date: '', notes: '' });
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchMilk = async () => {
    try {
      const res = await api.get('/milk');
      setMilk(res.data);
    } catch (err) {
      setError('Failed to fetch milk records');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMilk();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.quantity || !form.date) {
      setError('Quantity and Date are required');
      return;
    }

    try {
      if (editing) {
        await api.put(`/milk/${editing._id}`, form);
        setSuccess('Milk record updated!');
      } else {
        await api.post('/milk', form);
        setSuccess('Milk record added!');
      }
      setForm({ quantity: '', date: '', notes: '' });
      setEditing(null);
      fetchMilk();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save milk record');
      console.error(err);
    }
  };

  const handleEdit = (record) => {
    setEditing(record);
    setForm({
      quantity: record.quantity,
      date: record.date?.slice(0, 10),
      notes: record.notes
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this milk record?')) return;
    try {
      await api.delete(`/milk/${id}`);
      fetchMilk();
    } catch (err) {
      setError('Failed to delete milk record');
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Milk Production Records</h2>
      
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity (liters)
            </label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <input
              type="text"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editing ? 'Update' : 'Add'} Record
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm({ quantity: '', date: '', notes: '' });
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {milk.map((record) => (
              <tr
                key={record._id}
                className={editing?.id === record._id ? 'bg-blue-50' : ''}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {record.date?.slice(0, 10)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {record.quantity} liters
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{record.notes}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleEdit(record)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(record._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

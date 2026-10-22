import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';

const CATEGORIES = ['Music', 'Tech', 'Sports', 'Art', 'Food', 'Business', 'Other'];

export default function CreateEventPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    venue: '',
    totalSeats: '',
    price: '',
    category: 'Tech',
    imageUrl: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.date || !form.venue || !form.totalSeats || form.price === '') {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/events', {
        ...form,
        totalSeats: Number(form.totalSeats),
        price: Number(form.price),
      });
      toast.success('🎉 Event created successfully!');
      navigate(`/events/${res.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ padding: '2rem 0' }}>
      <div className="container">
        <div className="page-header" style={{ textAlign: 'left', padding: '1rem 0 2rem' }}>
          <h1 className="page-title" style={{ textAlign: 'left' }}>🎪 Create New Event</h1>
          <p className="page-subtitle" style={{ textAlign: 'left' }}>Fill in the details to list your event</p>
        </div>

        <div className="form-container wide" style={{ margin: '0' }}>
          <form onSubmit={handleSubmit} id="create-event-form">
            <div className="form-group">
              <label className="form-label" htmlFor="ev-title">Event Title *</label>
              <input
                id="ev-title"
                type="text"
                name="title"
                className="form-input"
                placeholder="e.g. CHARUSAT Tech Summit 2026"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="ev-description">Description *</label>
              <textarea
                id="ev-description"
                name="description"
                className="form-input"
                placeholder="Describe your event..."
                value={form.description}
                onChange={handleChange}
                rows={4}
                required
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="form-input-row">
              <div className="form-group">
                <label className="form-label" htmlFor="ev-date">Date &amp; Time *</label>
                <input
                  id="ev-date"
                  type="datetime-local"
                  name="date"
                  className="form-input"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="ev-category">Category</label>
                <select
                  id="ev-category"
                  name="category"
                  className="form-input"
                  value={form.category}
                  onChange={handleChange}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="ev-venue">Venue *</label>
              <input
                id="ev-venue"
                type="text"
                name="venue"
                className="form-input"
                placeholder="e.g. CSPIT Auditorium, CHARUSAT Campus"
                value={form.venue}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-input-row">
              <div className="form-group">
                <label className="form-label" htmlFor="ev-seats">Total Seats *</label>
                <input
                  id="ev-seats"
                  type="number"
                  name="totalSeats"
                  className="form-input"
                  placeholder="e.g. 200"
                  value={form.totalSeats}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="ev-price">Price (₹) *</label>
                <input
                  id="ev-price"
                  type="number"
                  name="price"
                  className="form-input"
                  placeholder="0 for FREE"
                  value={form.price}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="ev-image">Image URL (optional)</label>
              <input
                id="ev-image"
                type="url"
                name="imageUrl"
                className="form-input"
                placeholder="https://example.com/image.jpg"
                value={form.imageUrl}
                onChange={handleChange}
              />
            </div>

            <button
              id="create-event-btn"
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={loading}
              style={{ marginTop: '0.5rem' }}
            >
              {loading ? '⏳ Creating...' : '🚀 Create Event'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

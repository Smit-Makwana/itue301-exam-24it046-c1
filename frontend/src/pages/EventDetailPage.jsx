import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const CATEGORY_ICONS = {
  Music: '🎵', Tech: '💻', Sports: '⚽', Art: '🎨',
  Food: '🍕', Business: '💼', Other: '🎪',
};

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    api.get(`/events/${id}`)
      .then((res) => setEvent(res.data))
      .catch(() => toast.error('Event not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async () => {
    if (!user) {
      toast.error('Please login to book tickets');
      navigate('/login');
      return;
    }
    setBooking(true);
    try {
      await api.post('/tickets', { eventId: id, quantity });
      toast.success(`🎉 ${quantity} ticket(s) booked successfully!`);
      // Refresh event data
      const res = await api.get(`/events/${id}`);
      setEvent(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return (
    <div className="page">
      <div className="loading-state">
        <div className="spinner" />
        <span>Loading event...</span>
      </div>
    </div>
  );

  if (!event) return (
    <div className="page">
      <div className="empty-state">
        <div className="empty-icon">😕</div>
        <p className="empty-title">Event not found</p>
        <Link to="/events" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Events</Link>
      </div>
    </div>
  );

  const icon = CATEGORY_ICONS[event.category] || '🎪';
  const seatsPercent = event.totalSeats > 0 ? (event.availableSeats / event.totalSeats) * 100 : 0;
  const isSoldOut = event.availableSeats === 0;

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="page event-detail">
      <div className="container">
        <Link to="/events" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginBottom: '1.5rem' }}>
          ← Back to Events
        </Link>

        <div className="event-detail-hero">{icon}</div>

        <div className="event-detail-grid">
          <div className="event-detail-info">
            <span className="event-category">{icon} {event.category}</span>
            <h1 className="event-detail-title">{event.title}</h1>

            <div className="event-detail-meta">
              <span className="detail-meta-item">📅 {formatDate(event.date)}</span>
              <span className="detail-meta-item">📍 {event.venue}</span>
              <span className="detail-meta-item">👤 {event.organizer?.name}</span>
              <span className="detail-meta-item">🎫 {event.totalSeats} total seats</span>
            </div>

            <p className="event-detail-description">{event.description}</p>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>ORGANIZED BY</p>
              <p style={{ fontWeight: '600' }}>{event.organizer?.name}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{event.organizer?.email}</p>
            </div>
          </div>

          {/* Booking Card */}
          <div className="booking-card">
            <div className="booking-price">
              {event.price === 0 ? 'FREE' : `₹${event.price}`}
            </div>
            <div className="booking-per">per ticket</div>

            <div className="booking-seats-bar">
              <div className="booking-seats-fill" style={{ width: `${seatsPercent}%` }} />
            </div>
            <div className="booking-seats-text">
              {isSoldOut ? '❌ Sold Out' : `${event.availableSeats} / ${event.totalSeats} seats available`}
            </div>

            {!isSoldOut && (
              <>
                <label className="form-label">Quantity</label>
                <div className="qty-input">
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    id="qty-decrease"
                  >−</button>
                  <span className="qty-value">{quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity(Math.min(event.availableSeats, quantity + 1))}
                    disabled={quantity >= event.availableSeats}
                    id="qty-increase"
                  >+</button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <span>Total</span>
                  <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                    {event.price === 0 ? 'FREE' : `₹${event.price * quantity}`}
                  </span>
                </div>

                <button
                  id="book-ticket-btn"
                  className="btn btn-primary btn-full btn-lg"
                  onClick={handleBook}
                  disabled={booking}
                >
                  {booking ? '⏳ Booking...' : '🎟️ Book Now'}
                </button>

                {!user && (
                  <p style={{ textAlign: 'center', marginTop: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <Link to="/login" style={{ color: 'var(--accent-light)' }}>Login</Link> to book tickets
                  </p>
                )}
              </>
            )}

            {isSoldOut && (
              <div className="empty-state" style={{ minHeight: 'auto', padding: '1rem 0' }}>
                <div className="empty-icon">😔</div>
                <p className="empty-title">Sold Out</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  const fetchTickets = () => {
    api.get('/tickets/my')
      .then((res) => setTickets(res.data))
      .catch(() => toast.error('Failed to load tickets'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTickets(); }, []);

  const handleCancel = async (ticketId) => {
    if (!window.confirm('Cancel this ticket?')) return;
    setCancelling(ticketId);
    try {
      await api.delete(`/tickets/${ticketId}`);
      toast.success('Ticket cancelled');
      fetchTickets();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancellation failed');
    } finally {
      setCancelling(null);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  const CATEGORY_ICONS = {
    Music: '🎵', Tech: '💻', Sports: '⚽', Art: '🎨',
    Food: '🍕', Business: '💼', Other: '🎪',
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">🎫 My Tickets</h1>
          <p className="page-subtitle">Manage your event bookings</p>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <span>Loading your tickets...</span>
          </div>
        ) : tickets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎫</div>
            <p className="empty-title">No tickets yet</p>
            <p className="empty-desc">Book your first event ticket to see it here</p>
            <Link to="/events" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Browse Events
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '3rem' }}>
            {tickets.map((ticket) => {
              const event = ticket.eventId;
              const icon = event ? (CATEGORY_ICONS[event.category] || '🎪') : '🎟️';
              return (
                <div key={ticket._id} className={`ticket-card ${ticket.status}`} id={`ticket-${ticket._id}`}>
                  <div className="ticket-icon">{icon}</div>
                  <div className="ticket-info">
                    <h3 className="ticket-event-title">{event?.title || 'Event Deleted'}</h3>
                    <div className="ticket-meta">
                      {event?.date && (
                        <span className="ticket-meta-item">📅 {formatDate(event.date)}</span>
                      )}
                      {event?.venue && (
                        <span className="ticket-meta-item">📍 {event.venue}</span>
                      )}
                      <span className="ticket-meta-item">🎫 ×{ticket.quantity} ticket(s)</span>
                      <span className="ticket-meta-item">📅 Booked {formatDate(ticket.bookedAt)}</span>
                    </div>
                    <span className={`ticket-status ${ticket.status}`}>
                      {ticket.status === 'confirmed' ? '✅ Confirmed' : '❌ Cancelled'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                    <div className="ticket-price">
                      {ticket.totalPrice === 0 ? 'FREE' : `₹${ticket.totalPrice}`}
                    </div>
                    {ticket.status === 'confirmed' && (
                      <button
                        id={`cancel-btn-${ticket._id}`}
                        className="btn btn-danger btn-sm"
                        onClick={() => handleCancel(ticket._id)}
                        disabled={cancelling === ticket._id}
                      >
                        {cancelling === ticket._id ? '⏳ Cancelling...' : '✕ Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';

const CATEGORY_ICONS = {
  Music: '🎵',
  Tech: '💻',
  Sports: '⚽',
  Art: '🎨',
  Food: '🍕',
  Business: '💼',
  Other: '🎪',
};

export default function EventCard({ event }) {
  const icon = CATEGORY_ICONS[event.category] || '🎪';
  const pct = event.totalSeats > 0 ? (event.availableSeats / event.totalSeats) * 100 : 0;
  const seatsClass = event.availableSeats === 0 ? 'sold-out' : event.availableSeats <= 10 ? 'low' : '';
  const seatsLabel =
    event.availableSeats === 0
      ? 'Sold Out'
      : event.availableSeats <= 10
      ? `⚡ Only ${event.availableSeats} left!`
      : `${event.availableSeats} seats left`;

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <Link to={`/events/${event._id}`} style={{ display: 'block' }}>
      <div className="event-card">
        <div className="event-card-image">{icon}</div>
        <div className="event-card-body">
          <span className="event-category">{icon} {event.category}</span>
          <h3 className="event-title">{event.title}</h3>
          <div className="event-meta">
            <span className="event-meta-item">
              <span className="meta-icon">📅</span>
              {formatDate(event.date)}
            </span>
            <span className="event-meta-item">
              <span className="meta-icon">📍</span>
              {event.venue}
            </span>
            <span className="event-meta-item">
              <span className="meta-icon">👤</span>
              {event.organizer?.name || 'Organizer'}
            </span>
          </div>
          <div className="event-card-footer">
            <span className="event-price">
              {event.price === 0 ? 'FREE' : `₹${event.price}`}
            </span>
            <span className={`event-seats ${seatsClass}`}>{seatsLabel}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import EventCard from '../components/EventCard';

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/events').then((res) => {
      setEvents(res.data.slice(0, 3));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">✨ The Ultimate Event Experience</div>
            <h1 className="hero-title">
              Discover &amp; Book <span className="gradient-text">Amazing Events</span>
            </h1>
            <p className="hero-desc">
              From music concerts to tech summits, find and book tickets for the events you love.
              Create memorable moments with EventHub.
            </p>
            <div className="hero-actions">
              <Link to="/events" className="btn btn-primary btn-lg">🎟️ Browse Events</Link>
              <Link to="/register" className="btn btn-secondary btn-lg">Get Started →</Link>
            </div>

            <div className="hero-stats">
              <div className="stat-card">
                <div className="stat-number">500+</div>
                <div className="stat-label">Events Listed</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Happy Attendees</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">100%</div>
                <div className="stat-label">Satisfaction</div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="floating-cards">
              <div className="floating-card">
                <div className="fc-icon">🎵</div>
                <div className="fc-title">Music Fest</div>
                <div className="fc-sub">₹999 · 200 seats</div>
              </div>
              <div className="floating-card">
                <div className="fc-icon">💻</div>
                <div className="fc-title">Tech Summit</div>
                <div className="fc-sub">FREE · 500 seats</div>
              </div>
              <div className="floating-card">
                <div className="fc-icon">🎨</div>
                <div className="fc-title">Art Expo</div>
                <div className="fc-sub">₹499 · 150 seats</div>
              </div>
              <div className="floating-card">
                <div className="fc-icon">⚽</div>
                <div className="fc-title">Sports Day</div>
                <div className="fc-sub">₹299 · 350 seats</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">🔥 Featured Events</h2>
            <Link to="/events" className="btn btn-secondary btn-sm">View All →</Link>
          </div>
          {loading ? (
            <div className="loading-state">
              <div className="spinner" />
              <span>Loading events...</span>
            </div>
          ) : events.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎪</div>
              <p className="empty-title">No events yet</p>
              <p className="empty-desc">Be the first to create an event!</p>
              <Link to="/create-event" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Create Event
              </Link>
            </div>
          ) : (
            <div className="cards-grid">
              {events.map((e) => <EventCard key={e._id} event={e} />)}
            </div>
          )}
        </div>
      </section>

      <footer>
        <p>© 2026 EventHub · Built with ❤️ using React + Express + MongoDB</p>
      </footer>
    </div>
  );
}

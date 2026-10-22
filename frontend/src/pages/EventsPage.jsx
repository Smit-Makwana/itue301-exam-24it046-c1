import { useEffect, useState } from 'react';
import api from '../api/axios';
import EventCard from '../components/EventCard';

const CATEGORIES = ['All', 'Music', 'Tech', 'Sports', 'Art', 'Food', 'Business', 'Other'];

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/events')
      .then((res) => { setEvents(res.data); setFiltered(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = events;
    if (activeCategory !== 'All') {
      result = result.filter((e) => e.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) => e.title.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [activeCategory, search, events]);

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">🎪 All Events</h1>
          <p className="page-subtitle">Discover events happening near you</p>
        </div>

        {/* Search */}
        <input
          type="text"
          className="form-input"
          placeholder="🔍 Search events by name or venue..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: '0.5rem' }}
          id="event-search"
        />

        {/* Category Filter */}
        <div className="filter-bar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`filter-chip${activeCategory === cat ? ' active' : ''}`}
              onClick={() => setActiveCategory(cat)}
              id={`filter-${cat.toLowerCase()}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <span>Loading events...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <p className="empty-title">No events found</p>
            <p className="empty-desc">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="cards-grid">
            {filtered.map((e) => <EventCard key={e._id} event={e} />)}
          </div>
        )}
      </div>
    </div>
  );
}

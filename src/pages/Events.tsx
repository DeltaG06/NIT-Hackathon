import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function Events() {
  const { user } = useAuth()
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [eventTypeFilter, setEventTypeFilter] = useState('All Types')
  const [domainFilter, setDomainFilter] = useState('All Domains')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: 'Hackathon',
    date: '',
    domains: '',
    location: '',
    organizer: '',
    registration_link: '',
  })

  useEffect(() => {
    fetchEvents()
  }, [eventTypeFilter, domainFilter])

  const fetchEvents = async () => {
    let query = supabase.from('events').select('*').order('date', { ascending: true })

    if (eventTypeFilter !== 'All Types') {
      query = query.eq('event_type', eventTypeFilter)
    }

    const { data } = await query

    if (data) {
      let filtered = data
      if (domainFilter !== 'All Domains') {
        filtered = data.filter((event) => {
          const eventDomains = event.domains || []
          return eventDomains.includes(domainFilter)
        })
      }
      setEvents(filtered)
    }
    setLoading(false)
  }

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const { error } = await supabase.from('events').insert({
        title: formData.title,
        description: formData.description,
        event_type: formData.event_type,
        date: formData.date,
        domains: formData.domains.split(',').map((d) => d.trim()),
        location: formData.location,
        organizer: formData.organizer,
        registration_link: formData.registration_link,
        created_by: user.id,
      })

      if (error) throw error

      setShowModal(false)
      setFormData({
        title: '',
        description: '',
        event_type: 'Hackathon',
        date: '',
        domains: '',
        location: '',
        organizer: '',
        registration_link: '',
      })
      fetchEvents()
    } catch (error: any) {
      alert('Error creating event: ' + error.message)
    }
  }

  const eventTypes = ['All Types', 'Hackathon', 'Workshop', 'Competition', 'Seminar', 'Other']
  const allDomains = Array.from(
    new Set(
      events.flatMap((e) => e.domains || []).filter((d: string) => d && d.trim())
    )
  )

  return (
    <div className="flex-1 p-8 bg-silver-light min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-black mb-2">Events</h1>
            <p className="text-silver-dark">Discover hackathons, workshops, and competitions</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-navy text-white px-6 py-3 rounded-lg font-medium hover:bg-navy-light transition-colors flex items-center gap-2"
          >
            <span>+</span>
            <span>Add Event</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 shadow-md mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🔍</span>
            <h2 className="text-xl font-bold text-black">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">Event Type</label>
              <select
                value={eventTypeFilter}
                onChange={(e) => setEventTypeFilter(e.target.value)}
                className="w-full px-4 py-2 border border-silver rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
              >
                {eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Domain</label>
              <select
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value)}
                className="w-full px-4 py-2 border border-silver rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
              >
                <option value="All Domains">All Domains</option>
                {allDomains.map((domain: string) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-silver-dark">Loading...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <span className="text-6xl mb-4 block">📅</span>
            <p className="text-silver-dark text-lg">
              No events found. Try adjusting your filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-black">{event.title}</h3>
                  <span className="px-2 py-1 bg-navy text-white text-xs rounded">
                    {event.event_type}
                  </span>
                </div>
                <p className="text-silver-dark text-sm mb-4 line-clamp-3">
                  {event.description}
                </p>
                <div className="space-y-2 text-sm text-silver-dark">
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span>{event.location}</span>
                  </div>
                  {event.domains && event.domains.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {event.domains.slice(0, 3).map((domain: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-silver-light text-black text-xs rounded"
                        >
                          {domain}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-silver flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-black">Add New Event</h2>
                <p className="text-silver-dark text-sm mt-1">
                  Share an upcoming event with the community
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-silver-dark hover:text-black text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="e.g., HackMIT 2025"
                  className="w-full px-4 py-2 border border-silver rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  placeholder="Describe the event..."
                  className="w-full px-4 py-2 border border-silver rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Event Type
                </label>
                <select
                  value={formData.event_type}
                  onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                  className="w-full px-4 py-2 border border-silver rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                >
                  <option value="Hackathon">Hackathon</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Competition">Competition</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-silver rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Domains (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.domains}
                  onChange={(e) => setFormData({ ...formData, domains: e.target.value })}
                  placeholder="e.g., AI/ML, Web Dev, IoT"
                  className="w-full px-4 py-2 border border-silver rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                  placeholder="e.g., Online / Cambridge, MA"
                  className="w-full px-4 py-2 border border-silver rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">Organizer</label>
                <input
                  type="text"
                  value={formData.organizer}
                  onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                  required
                  placeholder="e.g., MIT Computer Science Club"
                  className="w-full px-4 py-2 border border-silver rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Registration Link
                </label>
                <input
                  type="url"
                  value={formData.registration_link}
                  onChange={(e) =>
                    setFormData({ ...formData, registration_link: e.target.value })
                  }
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-silver rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 border border-silver rounded-lg text-black hover:bg-silver-light transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-navy text-white rounded-lg font-medium hover:bg-navy-light transition-colors"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}


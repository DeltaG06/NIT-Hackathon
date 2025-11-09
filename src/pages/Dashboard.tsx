import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    activeProjects: 0,
    upcomingEvents: 0,
    skills: 0,
    network: 'Growing',
  })
  const [recentProjects, setRecentProjects] = useState<any[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([])
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    if (!user) return

    // Fetch user profile
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
    if (profile) {
      setUserProfile(profile)
      setStats((prev) => ({
        ...prev,
        skills: profile.skills?.length || 0,
      }))
    }

    // Fetch user's projects
    const { data: projects } = await supabase
      .from('project_members')
      .select('project_id, projects(*)')
      .eq('user_id', user.id)
    if (projects) {
      setStats((prev) => ({
        ...prev,
        activeProjects: projects.length,
      }))
      // Get the most recent 3 projects, sorted by created_at
      const projectData = projects
        .map((p: any) => p.projects)
        .filter((p: any) => p !== null)
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 3)
      setRecentProjects(projectData)
    }

    // Fetch upcoming events
    const { data: events } = await supabase
      .from('events')
      .select('*')
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true })
      .limit(3)
    if (events) {
      setStats((prev) => ({
        ...prev,
        upcomingEvents: events.length,
      }))
      setUpcomingEvents(events)
    }
  }

  return (
    <div className="flex-1 p-8 bg-silver-light min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-navy to-navy-light rounded-lg p-8 mb-8 text-white">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {userProfile?.name || 'User'}! 👋
          </h1>
          <p className="text-silver-light text-lg">
            Discover new projects, connect with peers, and make your ideas reality.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-silver-dark text-sm mb-1">Active Projects</p>
                <p className="text-3xl font-bold text-black">{stats.activeProjects}</p>
                <p className="text-xs text-silver-dark mt-1">Available now</p>
              </div>
              <span className="text-3xl">💡</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-silver-dark text-sm mb-1">Upcoming Events</p>
                <p className="text-3xl font-bold text-black">{stats.upcomingEvents}</p>
                <p className="text-xs text-silver-dark mt-1">This month</p>
              </div>
              <span className="text-3xl">📅</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-silver-dark text-sm mb-1">Your Skills</p>
                <p className="text-3xl font-bold text-black">{stats.skills}</p>
                <p className="text-xs text-silver-dark mt-1">Skills listed</p>
              </div>
              <span className="text-3xl">📊</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-silver-dark text-sm mb-1">Network</p>
                <p className="text-3xl font-bold text-black">{stats.network}</p>
                <p className="text-xs text-silver-dark mt-1">Connect more</p>
              </div>
              <span className="text-3xl">👥</span>
            </div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-lg p-6 shadow-md mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-black">Recent Projects</h2>
            <button
              onClick={() => navigate('/projects')}
              className="text-navy hover:underline"
            >
              View All
            </button>
          </div>
          {recentProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentProjects.map((project: any) => (
                <div
                  key={project.id}
                  className="border border-silver rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer bg-white"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  {/* Project Image */}
                  {project.image_url && (
                    <div className="w-full h-32 bg-silver-light overflow-hidden">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-black mb-2 text-lg">{project.title}</h3>
                    <p className="text-sm text-silver-dark line-clamp-2 mb-3">
                      {project.description}
                    </p>
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {project.tags.slice(0, 2).map((tag: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-silver-light text-black text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-silver-dark mt-2">
                      <span>👥</span>
                      <span>View Details →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">💡</span>
              <p className="text-silver-dark">No projects yet. Be the first to create one!</p>
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-black">Upcoming Events</h2>
            <button
              onClick={() => navigate('/events')}
              className="text-navy hover:underline"
            >
              View All
            </button>
          </div>
          {upcomingEvents.length > 0 ? (
            <div className="space-y-4">
              {upcomingEvents.map((event: any) => (
                <div
                  key={event.id}
                  className="border border-silver rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  <h3 className="font-semibold text-black mb-1">{event.title}</h3>
                  <p className="text-sm text-silver-dark">
                    {new Date(event.date).toLocaleDateString()} • {event.location}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">📅</span>
              <p className="text-silver-dark">No upcoming events. Check back later!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


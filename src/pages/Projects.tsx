import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function Projects() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    required_skills: '',
    looking_for: '',
    repo_link: '',
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select(`
        *,
        project_members (
          user_id,
          role,
          users (
            name,
            avatar_url
          )
        )
      `)
      .order('created_at', { ascending: false })

    if (data) {
      setProjects(data)
    }
    setLoading(false)
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      // Insert project
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          title: formData.title,
          description: formData.description,
          tags: formData.tags.split(',').map((t) => t.trim()),
          required_skills: formData.required_skills.split(',').map((s) => s.trim()),
          looking_for: formData.looking_for,
        })
        .select()
        .single()

      if (projectError) throw projectError

      // Add owner to project_members
      await supabase.from('project_members').insert({
        project_id: project.id,
        user_id: user.id,
        role: 'owner',
      })

      // Add repo link if provided
      if (formData.repo_link) {
        await supabase.from('project_private_data').insert({
          project_id: project.id,
          repo_link: formData.repo_link,
        })
      }

      setShowModal(false)
      setFormData({
        title: '',
        description: '',
        tags: '',
        required_skills: '',
        looking_for: '',
        repo_link: '',
      })
      fetchProjects()
    } catch (error: any) {
      alert('Error creating project: ' + error.message)
    }
  }

  return (
    <div className="flex-1 p-8 bg-silver-light min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-black mb-2">Projects</h1>
            <p className="text-silver-dark">Discover and collaborate on amazing projects</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-navy text-white px-6 py-3 rounded-lg font-medium hover:bg-navy-light transition-colors flex items-center gap-2"
          >
            <span>+</span>
            <span>New Project</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-silver-dark">Loading...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <span className="text-6xl mb-4 block">💡</span>
            <p className="text-silver-dark text-lg">No projects yet. Create the first one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold text-black mb-2">{project.title}</h3>
                <p className="text-silver-dark text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.slice(0, 3).map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-silver-light text-black text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-silver-dark">
                  <span>👥</span>
                  <span>
                    {project.project_members?.length || 0} member
                    {(project.project_members?.length || 0) !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-silver flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-black">Create New Project</h2>
                <p className="text-silver-dark text-sm mt-1">
                  Share your idea and find collaborators
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-silver-dark hover:text-black text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="e.g., AI-powered Study Assistant"
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
                  placeholder="Describe your project idea..."
                  className="w-full px-4 py-2 border border-silver rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g., AI/ML, Web Dev, Mobile"
                  className="w-full px-4 py-2 border border-silver rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Required Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.required_skills}
                  onChange={(e) =>
                    setFormData({ ...formData, required_skills: e.target.value })
                  }
                  placeholder="e.g., Python, React, TensorFlow"
                  className="w-full px-4 py-2 border border-silver rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Looking For
                </label>
                <textarea
                  value={formData.looking_for}
                  onChange={(e) => setFormData({ ...formData, looking_for: e.target.value })}
                  rows={3}
                  placeholder="What kind of team members are you looking for?"
                  className="w-full px-4 py-2 border border-silver rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Repository Link (optional)
                </label>
                <input
                  type="url"
                  value={formData.repo_link}
                  onChange={(e) => setFormData({ ...formData, repo_link: e.target.value })}
                  placeholder="https://github.com/..."
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
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}


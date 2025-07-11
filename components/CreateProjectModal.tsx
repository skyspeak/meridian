import React, { useState } from 'react'
import { XMarkIcon, UserPlusIcon } from '@heroicons/react/24/outline'
import { projectStore } from '../lib/store'
import { Project, User } from '../types'

interface CreateProjectModalProps {
  open: boolean
  onClose: () => void
}

export default function CreateProjectModal({ open, onClose }: CreateProjectModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: 'medium' as const,
    tags: '',
    assignedUsers: [] as string[],
    requiredUsers: [] as string[]
  })

  const users = projectStore.getAllUsers()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const projectData = {
      ...formData,
      status: 'draft' as const,
      stage: 'initial_assessment' as const,
      createdBy: '2', // Mike Chen (current user)
      evidence: [],
      approvals: [],
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    }

    projectStore.createProject(projectData)
    onClose()
    setFormData({
      name: '',
      description: '',
      priority: 'medium',
      tags: '',
      assignedUsers: [],
      requiredUsers: []
    })
  }

  const handleUserToggle = (userId: string, type: 'assigned' | 'required') => {
    const field = type === 'assigned' ? 'assignedUsers' : 'requiredUsers'
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(userId)
        ? prev[field].filter(id => id !== userId)
        : [...prev[field], userId]
    }))
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Create New Project</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="input-field"
                  placeholder="Enter project name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="input-field"
                  rows={3}
                  placeholder="Describe the AI project and its compliance requirements"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="input-field"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  className="input-field"
                  placeholder="AI, ML, Customer Service (comma separated)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned Users
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {users.map((user) => (
                    <label key={user.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.assignedUsers.includes(user.id)}
                        onChange={() => handleUserToggle(user.id, 'assigned')}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {user.name} ({user.department})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Approvers
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {users.map((user) => (
                    <label key={user.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.requiredUsers.includes(user.id)}
                        onChange={() => handleUserToggle(user.id, 'required')}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {user.name} ({user.department})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </form>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              onClick={handleSubmit}
              className="btn-primary w-full sm:w-auto sm:ml-3"
            >
              Create Project
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary w-full sm:w-auto mt-3 sm:mt-0"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 
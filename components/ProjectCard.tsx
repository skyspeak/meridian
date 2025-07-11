import React from 'react'
import { EyeIcon, PencilIcon, UserIcon } from '@heroicons/react/24/outline'
import { Project, ProjectStage } from '../types'
import { projectStore } from '../lib/store'

interface ProjectCardProps {
  project: Project
  onView?: () => void
  onEdit?: () => void
}

export default function ProjectCard({ project, onView, onEdit }: ProjectCardProps) {
  const users = projectStore.getAllUsers()
  
  const getStageColor = (stage: ProjectStage) => {
    const colors = {
      initial_assessment: 'bg-blue-100 text-blue-800',
      legal_review: 'bg-purple-100 text-purple-800',
      technical_review: 'bg-yellow-100 text-yellow-800',
      compliance_check: 'bg-orange-100 text-orange-800',
      final_approval: 'bg-green-100 text-green-800',
      implementation: 'bg-indigo-100 text-indigo-800',
      monitoring: 'bg-gray-100 text-gray-800'
    }
    return colors[stage] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    }
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const assignedUsers = users.filter(user => project.assignedUsers.includes(user.id))
  const requiredUsers = users.filter(user => project.requiredUsers.includes(user.id))

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
          <p className="text-sm text-gray-600 mb-3">{project.description}</p>
          
          <div className="flex items-center space-x-2 mb-3">
            <span className={`badge ${getPriorityColor(project.priority)}`}>
              {project.priority}
            </span>
            <span className={`badge ${getStageColor(project.stage)}`}>
              {project.stage.replace('_', ' ')}
            </span>
          </div>
          
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
            <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {onView && (
            <button
              onClick={onView}
              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
            >
              <EyeIcon className="h-4 w-4" />
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <UserIcon className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-500">
              {assignedUsers.length} assigned, {requiredUsers.length} required
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            {assignedUsers.slice(0, 3).map((user) => (
              <div
                key={user.id}
                className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center"
                title={user.name}
              >
                <span className="text-xs font-medium text-gray-600">
                  {user.name.charAt(0)}
                </span>
              </div>
            ))}
            {assignedUsers.length > 3 && (
              <span className="text-xs text-gray-500">+{assignedUsers.length - 3}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 
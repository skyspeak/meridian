import React, { useState } from 'react'
import { PlusIcon, EyeIcon, PencilIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { projectStore } from '../lib/store'
import { Project, ProjectStage } from '../types'
import StatsCard from './StatsCard'
import ProjectCard from './ProjectCard'
import WorkflowOverview from './WorkflowOverview'
import CreateProjectModal from './CreateProjectModal'

export default function Dashboard() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const projects = projectStore.getAllProjects()
  const stats = projectStore.getDashboardStats()

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

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of AI project compliance and approvals
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>New Project</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Total Projects"
          value={stats.totalProjects}
          change="+12%"
          changeType="increase"
          icon="DocumentTextIcon"
        />
        <StatsCard
          title="Active Projects"
          value={stats.activeProjects}
          change="+5%"
          changeType="increase"
          icon="ClockIcon"
        />
        <StatsCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          change="-2%"
          changeType="decrease"
          icon="ExclamationTriangleIcon"
        />
        <StatsCard
          title="Completed This Month"
          value={stats.completedThisMonth}
          change="+8%"
          changeType="increase"
          icon="CheckCircleIcon"
        />
      </div>

      {/* Roadmap Builder Quick Access */}
      <div className="mb-8">
        <div className="card bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <SparklesIcon className="h-10 w-10 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">AI Roadmap Builder</h3>
                <p className="text-sm text-gray-600">
                  Generate comprehensive project plans with gates, checkpoints, and resource recommendations
                </p>
              </div>
            </div>
            <a
              href="/roadmap"
              className="btn-primary flex items-center space-x-2"
            >
              <SparklesIcon className="h-5 w-5" />
              <span>Build Roadmap</span>
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
              <a href="#" className="text-sm text-primary-600 hover:text-primary-500">
                View all
              </a>
            </div>
            <div className="space-y-4">
              {projects.slice(0, 5).map((project) => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-sm font-medium text-gray-900">{project.name}</h3>
                        <span className={`badge ${getPriorityColor(project.priority)}`}>{project.priority}</span>
                        <span className={`badge ${getStageColor(project.stage)}`}>{project.stage.replace('_', ' ')}</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">{project.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                        <div className="flex items-center space-x-4">
                          <button className="flex items-center space-x-1 hover:text-primary-600">
                            <EyeIcon className="h-4 w-4" />
                            <span>View</span>
                          </button>
                          <button className="flex items-center space-x-1 hover:text-primary-600">
                            <PencilIcon className="h-4 w-4" />
                            <span>Edit</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Workflow Overview */}
        <div className="lg:col-span-1">
          <WorkflowOverview />
        </div>
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  )
} 
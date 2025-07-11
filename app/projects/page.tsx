'use client'

import React, { useState } from 'react'
import { PlusIcon, FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { projectStore } from '../../lib/store'
import { Project, ProjectStage } from '../../types'
import ProjectCard from '../../components/ProjectCard'
import CreateProjectModal from '../../components/CreateProjectModal'
import ProjectDetail from '../../components/ProjectDetail'
import Layout from '../../components/Layout'

export default function ProjectsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [stageFilter, setStageFilter] = useState<string>('all')
  
  const projects = projectStore.getAllProjects()
  const users = projectStore.getAllUsers()

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    const matchesStage = stageFilter === 'all' || project.stage === stageFilter
    
    return matchesSearch && matchesStatus && matchesStage
  })

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

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage AI compliance projects and workflows
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

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="in_review">In Review</option>
                <option value="pending_approval">Pending Approval</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>
              
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Stages</option>
                <option value="initial_assessment">Initial Assessment</option>
                <option value="legal_review">Legal Review</option>
                <option value="technical_review">Technical Review</option>
                <option value="compliance_check">Compliance Check</option>
                <option value="final_approval">Final Approval</option>
                <option value="implementation">Implementation</option>
                <option value="monitoring">Monitoring</option>
              </select>
            </div>
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onView={() => setSelectedProject(project)}
              onEdit={() => setSelectedProject(project)}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <FunnelIcon className="h-12 w-12" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No projects found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' || stageFilter !== 'all'
                ? 'Try adjusting your filters.'
                : 'Get started by creating a new project.'}
            </p>
            {!searchTerm && statusFilter === 'all' && stageFilter === 'all' && (
              <div className="mt-6">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn-primary"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  New Project
                </button>
              </div>
            )}
          </div>
        )}

        {/* Stats Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary-600">{projects.length}</div>
            <div className="text-sm text-gray-500">Total Projects</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {projects.filter(p => ['draft', 'in_review', 'pending_approval'].includes(p.status)).length}
            </div>
            <div className="text-sm text-gray-500">Active Projects</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600">
              {projects.filter(p => p.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-red-600">
              {projects.filter(p => p.status === 'rejected').length}
            </div>
            <div className="text-sm text-gray-500">Rejected</div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateProjectModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {selectedProject && (
        <ProjectDetail
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </Layout>
  )
} 
import React, { useState, useEffect } from 'react'
import { 
  ArrowRightIcon, 
  DocumentTextIcon, 
  LinkIcon, 
  PhotoIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { Project, ProjectStage, Evidence, AuditEntry } from '../types'
import { projectStore } from '../lib/store'

interface ProjectDetailProps {
  project: Project
  onClose: () => void
}

export default function ProjectDetail({ project: initialProject, onClose }: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'workflow' | 'evidence' | 'audit'>('overview')
  const [showAddEvidence, setShowAddEvidence] = useState(false)
  const [project, setProject] = useState<Project>(initialProject)

  // Refresh project from store if the prop changes (e.g., when opening a new project)
  useEffect(() => {
    setProject(initialProject)
  }, [initialProject])

  const users = projectStore.getAllUsers()
  const workflowStages = projectStore.getWorkflowStages()
  const currentStage = projectStore.getCurrentStage(project.id)
  const nextStage = projectStore.getNextStage(project.id)

  const assignedUsers = users.filter(user => project.assignedUsers.includes(user.id))
  const requiredUsers = users.filter(user => project.requiredUsers.includes(user.id))

  const getStageColor = (stage: ProjectStage) => {
    const colors = {
      initial_assessment: 'bg-blue-500',
      legal_review: 'bg-purple-500',
      technical_review: 'bg-yellow-500',
      compliance_check: 'bg-orange-500',
      final_approval: 'bg-green-500',
      implementation: 'bg-indigo-500',
      monitoring: 'bg-gray-500'
    }
    return colors[stage] || 'bg-gray-500'
  }

  const getStageStatus = (stage: ProjectStage) => {
    const currentIndex = workflowStages.findIndex(s => s.id === project.stage)
    const stageIndex = workflowStages.findIndex(s => s.id === stage)
    
    if (stageIndex < currentIndex) return 'completed'
    if (stageIndex === currentIndex) return 'current'
    return 'pending'
  }

  const handleAdvanceStage = () => {
    if (nextStage) {
      projectStore.advanceProjectStage(project.id, nextStage.id, '2') // Current user
      // Refresh local project state from store
      const updated = projectStore.getProjectById(project.id)
      if (updated) setProject(updated)
    }
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: DocumentTextIcon },
    { id: 'workflow', name: 'Workflow', icon: ArrowRightIcon },
    { id: 'evidence', name: 'Evidence', icon: LinkIcon },
    { id: 'audit', name: 'Audit Trail', icon: ClockIcon },
  ]

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{project.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                      <span>{tab.name}</span>
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Project Details</h3>
                      <dl className="space-y-3">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Status</dt>
                          <dd className="text-sm text-gray-900">{project.status}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Current Stage</dt>
                          <dd className="text-sm text-gray-900">{project.stage.replace('_', ' ')}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Priority</dt>
                          <dd className="text-sm text-gray-900">{project.priority}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Created</dt>
                          <dd className="text-sm text-gray-900">
                            {new Date(project.createdAt).toLocaleDateString()}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <div className="card">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Team</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Assigned Users</h4>
                          <div className="space-y-2">
                            {assignedUsers.map((user) => (
                              <div key={user.id} className="flex items-center space-x-2">
                                <UserIcon className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-900">{user.name}</span>
                                <span className="text-xs text-gray-500">({user.department})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Required Approvers</h4>
                          <div className="space-y-2">
                            {requiredUsers.map((user) => (
                              <div key={user.id} className="flex items-center space-x-2">
                                <UserIcon className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-900">{user.name}</span>
                                <span className="text-xs text-gray-500">({user.department})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'workflow' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Workflow Progress</h3>
                    {nextStage && (
                      <button
                        onClick={handleAdvanceStage}
                        className="btn-primary flex items-center space-x-2"
                      >
                        <ArrowRightIcon className="h-4 w-4" />
                        <span>Advance to {nextStage.name}</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {workflowStages.map((stage, index) => {
                      const status = getStageStatus(stage.id)
                      const isCompleted = status === 'completed'
                      const isCurrent = status === 'current'
                      
                      return (
                        <div key={stage.id} className="flex items-center space-x-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isCompleted ? 'bg-green-500' : isCurrent ? getStageColor(stage.id) : 'bg-gray-200'
                          }`}>
                            {isCompleted ? (
                              <CheckCircleIcon className="h-5 w-5 text-white" />
                            ) : (
                              <span className="text-sm font-medium text-white">{index + 1}</span>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <h4 className={`text-sm font-medium ${
                              isCurrent ? 'text-gray-900' : 'text-gray-500'
                            }`}>
                              {stage.name}
                            </h4>
                            <p className="text-xs text-gray-500">{stage.description}</p>
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            {isCurrent && currentStage && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                Current
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'evidence' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Evidence & Documentation</h3>
                    <button
                      onClick={() => setShowAddEvidence(true)}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <PlusIcon className="h-4 w-4" />
                      <span>Add Evidence</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {project.evidence.map((evidence) => (
                      <div key={evidence.id} className="card">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                              <h4 className="text-sm font-medium text-gray-900">{evidence.title}</h4>
                              <span className={`badge ${evidence.verified ? 'badge-success' : 'badge-warning'}`}>
                                {evidence.verified ? 'Verified' : 'Pending'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{evidence.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>Uploaded by {users.find(u => u.id === evidence.uploadedBy)?.name}</span>
                              <span>{new Date(evidence.uploadedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {project.evidence.length === 0 && (
                      <div className="text-center py-8">
                        <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No evidence uploaded yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'audit' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Audit Trail</h3>
                  
                  <div className="space-y-4">
                    {project.auditTrail.map((entry) => (
                      <div key={entry.id} className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{entry.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                            <span>by {users.find(u => u.id === entry.userId)?.name}</span>
                            <span>{new Date(entry.timestamp).toLocaleString()}</span>
                            {entry.stage && (
                              <span className="badge badge-info">{entry.stage.replace('_', ' ')}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
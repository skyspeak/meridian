import React from 'react'
import { projectStore } from '../lib/store'
import { ProjectStage } from '../types'

export default function WorkflowOverview() {
  const workflowStages = projectStore.getWorkflowStages()
  const stats = projectStore.getDashboardStats()

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

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Workflow Stages</h2>
      
      <div className="space-y-4">
        {workflowStages.map((stage, index) => {
          const projectCount = stats.stageBreakdown[stage.id] || 0
          const isActive = projectCount > 0
          
          return (
            <div key={stage.id} className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className={`w-3 h-3 rounded-full ${getStageColor(stage.id)}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {stage.name}
                </p>
                <p className="text-xs text-gray-500">
                  {projectCount} project{projectCount !== 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="flex-shrink-0">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {isActive ? 'Active' : 'Empty'}
                </span>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Total Projects</span>
          <span className="font-medium text-gray-900">{stats.totalProjects}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-gray-500">Active Projects</span>
          <span className="font-medium text-gray-900">{stats.activeProjects}</span>
        </div>
      </div>
    </div>
  )
} 
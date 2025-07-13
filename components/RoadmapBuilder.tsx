import React, { useState } from 'react'
import { 
  SparklesIcon, 
  ClockIcon, 
  UserGroupIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  MapIcon,
  CalendarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import { RoadmapService } from '../lib/roadmapService'
import { RoadmapPlan, RoadmapGate, RoadmapCheckpoint, RoadmapResource } from '../types'

export default function RoadmapBuilder() {
  const [projectDescription, setProjectDescription] = useState('')
  const [industry, setIndustry] = useState('technology')
  const [isGenerating, setIsGenerating] = useState(false)
  const [roadmap, setRoadmap] = useState<RoadmapPlan | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'gates' | 'resources' | 'timeline'>('overview')

  const handleGenerateRoadmap = async () => {
    if (!projectDescription.trim()) return

    setIsGenerating(true)
    try {
      const generatedRoadmap = await RoadmapService.generateRoadmap(projectDescription, industry)
      setRoadmap(generatedRoadmap)
    } catch (error) {
      console.error('Error generating roadmap:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const getRiskLevelColor = (riskLevel: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    }
    return colors[riskLevel as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getComplexityColor = (complexity: string) => {
    const colors = {
      simple: 'bg-green-100 text-green-800',
      moderate: 'bg-blue-100 text-blue-800',
      complex: 'bg-orange-100 text-orange-800',
      enterprise: 'bg-purple-100 text-purple-800'
    }
    return colors[complexity as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const formatDuration = (days: number) => {
    if (days >= 365) {
      const years = Math.floor(days / 365)
      const remainingDays = days % 365
      return `${years} year${years > 1 ? 's' : ''}${remainingDays > 0 ? ` ${remainingDays} days` : ''}`
    }
    if (days >= 30) {
      const months = Math.floor(days / 30)
      const remainingDays = days % 30
      return `${months} month${months > 1 ? 's' : ''}${remainingDays > 0 ? ` ${remainingDays} days` : ''}`
    }
    return `${days} day${days > 1 ? 's' : ''}`
  }

  const formatBudget = (budget: { min: number; max: number; currency: string }) => {
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: budget.currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount)
    }
    return `${formatCurrency(budget.min)} - ${formatCurrency(budget.max)}`
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <SparklesIcon className="h-8 w-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Roadmap Builder</h1>
            <p className="text-sm text-gray-500">
              AI-powered project planning with comprehensive gates, checkpoints, and resource recommendations
            </p>
          </div>
        </div>
      </div>

      {/* Input Section */}
      {!roadmap && (
        <div className="card mb-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Describe Your Project</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description
                </label>
                <textarea
                  id="projectDescription"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Describe your project in detail. For example: 'Drug discovery for a type 3 diabetes treatment with AI-powered molecule screening and clinical trial planning'"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <select
                  id="industry"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                >
                  <option value="technology">Technology</option>
                  <option value="pharmaceutical">Pharmaceutical</option>
                </select>
              </div>
              <button
                onClick={handleGenerateRoadmap}
                disabled={!projectDescription.trim() || isGenerating}
                className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generating Roadmap...</span>
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-5 w-5" />
                    <span>Generate AI Roadmap</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {roadmap && (
        <div className="space-y-6">
          {/* Project Overview */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{roadmap.projectTitle}</h2>
                <p className="text-gray-600 mt-1">{roadmap.projectDescription}</p>
              </div>
              <button
                onClick={() => setRoadmap(null)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Start Over
              </button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <CalendarIcon className="h-6 w-6 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-900">Duration</p>
                    <p className="text-lg font-semibold text-blue-900">{formatDuration(roadmap.estimatedTotalDuration)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-900">Budget</p>
                    <p className="text-lg font-semibold text-green-900">{formatBudget(roadmap.estimatedBudget)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <MapIcon className="h-6 w-6 text-purple-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-purple-900">Gates</p>
                    <p className="text-lg font-semibold text-purple-900">{roadmap.gates.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <UserGroupIcon className="h-6 w-6 text-orange-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-orange-900">Resources</p>
                    <p className="text-lg font-semibold text-orange-900">{roadmap.resources.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Complexity and Industry */}
            <div className="flex items-center space-x-4 mb-6">
              <span className={`badge ${getComplexityColor(roadmap.complexity)}`}>
                {roadmap.complexity.charAt(0).toUpperCase() + roadmap.complexity.slice(1)} Complexity
              </span>
              <span className="badge bg-gray-100 text-gray-800">
                {roadmap.industry.charAt(0).toUpperCase() + roadmap.industry.slice(1)} Industry
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: DocumentTextIcon },
                { id: 'gates', name: 'Gates & Checkpoints', icon: MapIcon },
                { id: 'resources', name: 'Resources', icon: UserGroupIcon },
                { id: 'timeline', name: 'Timeline', icon: CalendarIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="card">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Risks & Assumptions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                        Key Risks
                      </h4>
                      <ul className="space-y-2">
                        {roadmap.risks.map((risk, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-red-500 mr-2">•</span>
                            <span className="text-sm text-gray-700">{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                        Assumptions
                      </h4>
                      <ul className="space-y-2">
                        {roadmap.assumptions.map((assumption, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            <span className="text-sm text-gray-700">{assumption}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'gates' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Project Gates & Checkpoints</h3>
                <div className="space-y-4">
                  {roadmap.gates.map((gate, index) => (
                    <div key={gate.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary-600">{index + 1}</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{gate.name}</h4>
                            <p className="text-sm text-gray-600">{gate.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`badge ${getRiskLevelColor(gate.riskLevel)}`}>
                            {gate.riskLevel}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDuration(gate.estimatedDuration)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Deliverables</h5>
                          <ul className="space-y-1">
                            {gate.deliverables.map((deliverable, idx) => (
                              <li key={idx} className="text-sm text-gray-700 flex items-center">
                                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                                {deliverable}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Success Criteria</h5>
                          <ul className="space-y-1">
                            {gate.successCriteria.map((criterion, idx) => (
                              <li key={idx} className="text-sm text-gray-700 flex items-center">
                                <CheckCircleIcon className="h-4 w-4 text-blue-500 mr-2" />
                                {criterion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Recommended Resources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roadmap.resources.map((resource) => (
                    <div key={resource.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{resource.name}</h4>
                          <p className="text-sm text-gray-600">{resource.role}</p>
                          <p className="text-xs text-gray-500">{resource.department}</p>
                        </div>
                        <span className={`badge ${
                          resource.availability === 'available' ? 'bg-green-100 text-green-800' :
                          resource.availability === 'partially_available' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {resource.availability.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="mb-3">
                        <h5 className="text-sm font-medium text-gray-900 mb-1">Expertise</h5>
                        <div className="flex flex-wrap gap-1">
                          {resource.expertise.map((skill, index) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{resource.estimatedTimeCommitment}h/week</span>
                        <a href={`mailto:${resource.contactInfo.email}`} className="text-primary-600 hover:text-primary-500">
                          {resource.contactInfo.email}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Project Timeline</h3>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  <div className="space-y-6">
                    {roadmap.gates.map((gate, index) => (
                      <div key={gate.id} className="relative flex items-start">
                        <div className="absolute left-4 w-3 h-3 bg-primary-500 rounded-full -translate-x-1.5"></div>
                        <div className="ml-8 flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{gate.name}</h4>
                            <span className="text-sm text-gray-500">{formatDuration(gate.estimatedDuration)}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{gate.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className={`badge ${getRiskLevelColor(gate.riskLevel)}`}>
                              {gate.riskLevel} risk
                            </span>
                            <span>{gate.deliverables.length} deliverables</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 
'use client'

import React, { useState, useRef, useEffect } from 'react'
import { 
  ChatBubbleLeftRightIcon, 
  PaperAirplaneIcon,
  DocumentArrowUpIcon,
  ClockIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  ShieldCheckIcon,
  UserIcon,
  CalendarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import Layout from '../../components/Layout'
import { auditLogService, AuditLogEntry } from '../../lib/auditLog'

interface ChecklistItem {
  id: string
  category: 'monitoring' | 'privacy' | 'compliance'
  question: string
  description: string
  required: boolean
  requiresEvidence: boolean
  evidenceType?: 'screenshot' | 'video' | 'document'
  completed: boolean
  notes?: string
  evidence?: File
}

interface Message {
  id: string
  type: 'user' | 'copilot'
  content: string
  timestamp: Date
}

const checklistItems: ChecklistItem[] = [
  {
    id: '1',
    category: 'monitoring',
    question: 'Data Collection Process Review',
    description: 'Has the data collection process changed since the last review?',
    required: true,
    requiresEvidence: false,
    completed: false
  },
  {
    id: '2',
    category: 'monitoring',
    question: 'Data Sources & Integrations',
    description: 'Are there any new data sources or third-party integrations?',
    required: true,
    requiresEvidence: false,
    completed: false
  },
  {
    id: '3',
    category: 'monitoring',
    question: 'Privacy Controls Update',
    description: 'Have the privacy controls and data handling procedures been updated?',
    required: true,
    requiresEvidence: false,
    completed: false
  },
  {
    id: '4',
    category: 'monitoring',
    question: 'User Consent Mechanism',
    description: 'Has the user consent mechanism been modified?',
    required: true,
    requiresEvidence: false,
    completed: false
  },
  {
    id: '5',
    category: 'monitoring',
    question: 'Data Retention Policies',
    description: 'Are there any changes to data retention policies?',
    required: true,
    requiresEvidence: false,
    completed: false
  },
  {
    id: '6',
    category: 'monitoring',
    question: 'Data Processing Scope',
    description: 'Has the data processing purpose or scope changed?',
    required: true,
    requiresEvidence: false,
    completed: false
  },
  {
    id: '7',
    category: 'privacy',
    question: 'Privacy Guarantees Validation',
    description: 'PRIVACY CHECKPOINT: Please validate privacy guarantees and upload evidence.',
    required: true,
    requiresEvidence: true,
    evidenceType: 'screenshot',
    completed: false
  },
  {
    id: '8',
    category: 'compliance',
    question: 'Compliance Documentation',
    description: 'Have compliance documentation and audit trails been updated?',
    required: true,
    requiresEvidence: false,
    completed: false
  },
  {
    id: '9',
    category: 'compliance',
    question: 'Regulatory Requirements',
    description: 'Are there any new regulatory requirements to address?',
    required: true,
    requiresEvidence: false,
    completed: false
  },
  {
    id: '10',
    category: 'compliance',
    question: 'Incident Response Review',
    description: 'Has the incident response and breach notification process been reviewed?',
    required: true,
    requiresEvidence: false,
    completed: false
  }
]

export default function MonitoringPage() {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(checklistItems)
  const [messages, setMessages] = useState<Message[]>([])
  const [userInput, setUserInput] = useState('')
  const [showWorkflowImage, setShowWorkflowImage] = useState(false)
  const [formData, setFormData] = useState({
    reviewer: 'Mike Chen',
    reviewDate: new Date().toISOString().split('T')[0],
    projectName: '',
    complianceStatus: 'pending' as 'pending' | 'compliant' | 'non_compliant'
  })
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Initialize chat with welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      type: 'copilot',
      content: 'Hello! I\'m here to help you with the monitoring checklist. You can ask me questions about any compliance requirements or workflow steps. The workflow diagram is available for reference.',
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }, [])

  const handleChecklistToggle = (itemId: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, completed: !item.completed }
        : item
    ))

    const item = checklist.find(i => i.id === itemId)
    if (item) {
      auditLogService.logMonitoringAction(
        item.completed ? 'checklist_item_unchecked' : 'checklist_item_checked',
        `${item.completed ? 'Unchecked' : 'Checked'} checklist item: ${item.question}`,
        '2', // Mike Chen
        { itemId, category: item.category }
      )
    }
  }

  const handleNotesChange = (itemId: string, notes: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, notes }
        : item
    ))
  }

  const handleFileUpload = (itemId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setChecklist(prev => prev.map(item => 
        item.id === itemId 
          ? { ...item, evidence: file }
          : item
      ))

      const item = checklist.find(i => i.id === itemId)
      if (item) {
        auditLogService.logPrivacyCheckpoint('2', item.evidenceType || 'file', file.name)
      }
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const completedItems = checklist.filter(item => item.completed).length
    const totalItems = checklist.length
    const completionRate = (completedItems / totalItems) * 100

    const formSubmissionData = {
      ...formData,
      checklist: checklist.map(item => ({
        id: item.id,
        completed: item.completed,
        notes: item.notes,
        hasEvidence: !!item.evidence
      })),
      completionRate,
      completedItems,
      totalItems
    }

    auditLogService.logFormSubmission('Monitoring Checklist', '2', formSubmissionData)

    // Show success message
    const successMessage: Message = {
      id: 'success',
      type: 'copilot',
      content: `Monitoring checklist submitted successfully! Completion rate: ${completionRate.toFixed(1)}% (${completedItems}/${totalItems} items completed).`,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, successMessage])
  }

  const handleSendMessage = () => {
    if (!userInput.trim()) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: userInput,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])

    auditLogService.logChatMessage(userInput, '2', true)

    // Clear input
    setUserInput('')

    // Simulate copilot response
    setTimeout(() => {
      const responses = [
        "I can help you with that. What specific aspect of the monitoring checklist do you need assistance with?",
        "That's a good question. Let me check the workflow requirements for you.",
        "Based on the compliance guidelines, here's what you need to know...",
        "I can see you're working on the monitoring phase. Let me guide you through the requirements.",
        "For that item, you'll need to ensure proper documentation and evidence collection."
      ]
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      const copilotMessage: Message = {
        id: `copilot-${Date.now()}`,
        type: 'copilot',
        content: randomResponse,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, copilotMessage])
      auditLogService.logChatMessage(randomResponse, '2', false)
    }, 1000)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'monitoring':
        return <DocumentTextIcon className="h-4 w-4 text-blue-600" />
      case 'privacy':
        return <ShieldCheckIcon className="h-4 w-4 text-orange-600" />
      case 'compliance':
        return <ExclamationCircleIcon className="h-4 w-4 text-green-600" />
      default:
        return <DocumentTextIcon className="h-4 w-4 text-gray-600" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'monitoring':
        return 'border-blue-200 bg-gradient-to-r from-blue-50 to-blue-25'
      case 'privacy':
        return 'border-orange-200 bg-gradient-to-r from-orange-50 to-orange-25'
      case 'compliance':
        return 'border-green-200 bg-gradient-to-r from-green-50 to-green-25'
      default:
        return 'border-gray-200 bg-gradient-to-r from-gray-50 to-gray-25'
    }
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'monitoring':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'privacy':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'compliance':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const completedItems = checklist.filter(item => item.completed).length
  const totalItems = checklist.length
  const completionRate = (completedItems / totalItems) * 100

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {/* Modern Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <SparklesIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Monitoring & Compliance
                  </h1>
                  <p className="text-lg text-gray-600 mt-1">
                    Complete the monitoring checklist with workflow reference and AI assistance
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowWorkflowImage(!showWorkflowImage)}
              className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center space-x-2">
                <EyeIcon className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                <span className="font-medium">{showWorkflowImage ? 'Hide' : 'Show'} Workflow</span>
              </div>
            </button>
          </div>
        </div>

        {/* Workflow Image Modal */}
        {showWorkflowImage && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20">
              <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity" onClick={() => setShowWorkflowImage(false)} />
              <div className="relative bg-white rounded-2xl max-w-5xl w-full p-8 shadow-2xl transform transition-all">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Compliance Workflow Reference</h3>
                  <button
                    onClick={() => setShowWorkflowImage(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="max-h-[70vh] overflow-y-auto rounded-lg border border-gray-200">
                  <img 
                    src="/workflow.png" 
                    alt="Compliance Workflow" 
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Modern Checklist Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <ChartBarIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Monitoring Checklist</h2>
                      <p className="text-blue-100">Complete all required items for compliance</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{completedItems}/{totalItems}</div>
                    <div className="text-blue-100 text-sm">completed</div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm text-blue-100 mb-2">
                    <span>Progress</span>
                    <span>{completionRate.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-white h-3 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${completionRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleFormSubmit} className="p-8 space-y-8">
                {/* Modern Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                      <UserIcon className="h-4 w-4 text-gray-500" />
                      <span>Reviewer</span>
                    </label>
                    <input
                      type="text"
                      value={formData.reviewer}
                      onChange={(e) => setFormData(prev => ({ ...prev, reviewer: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      placeholder="Enter reviewer name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4 text-gray-500" />
                      <span>Review Date</span>
                    </label>
                    <input
                      type="date"
                      value={formData.reviewDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, reviewDate: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                      <ShieldCheckIcon className="h-4 w-4 text-gray-500" />
                      <span>Status</span>
                    </label>
                    <select
                      value={formData.complianceStatus}
                      onChange={(e) => setFormData(prev => ({ ...prev, complianceStatus: e.target.value as any }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="compliant">✅ Compliant</option>
                      <option value="non_compliant">❌ Non-Compliant</option>
                    </select>
                  </div>
                </div>

                {/* Modern Checklist Items */}
                <div className="space-y-6">
                  {checklist.map((item, index) => (
                    <div
                      key={item.id}
                      className={`group relative p-6 border-2 rounded-2xl transition-all duration-300 hover:shadow-lg ${
                        item.completed 
                          ? 'border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 shadow-md' 
                          : getCategoryColor(item.category)
                      } ${item.completed ? 'scale-[1.02]' : 'hover:scale-[1.01]'}`}
                    >
                      {/* Category Badge */}
                      <div className="absolute top-4 right-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getCategoryBadge(item.category)}`}>
                          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                        </span>
                      </div>

                      <div className="flex items-start space-x-4">
                        {/* Modern Checkbox */}
                        <button
                          type="button"
                          onClick={() => handleChecklistToggle(item.id)}
                          className={`flex-shrink-0 mt-1 p-2 rounded-xl transition-all duration-300 ${
                            item.completed 
                              ? 'bg-green-500 text-white shadow-lg' 
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
                          }`}
                        >
                          {item.completed ? (
                            <CheckCircleIcon className="h-6 w-6" />
                          ) : (
                            <XCircleIcon className="h-6 w-6" />
                          )}
                        </button>
                        
                        <div className="flex-1 min-w-0 space-y-4">
                          <div>
                            <div className="flex items-center space-x-3 mb-3">
                              {getCategoryIcon(item.category)}
                              <h3 className="text-lg font-semibold text-gray-900">
                                {item.question}
                              </h3>
                              {item.required && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                                  Required
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                          
                          {/* Notes Field */}
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Notes & Comments
                            </label>
                            <textarea
                              value={item.notes || ''}
                              onChange={(e) => handleNotesChange(item.id, e.target.value)}
                              placeholder="Add your notes, observations, or additional context..."
                              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                              rows={3}
                            />
                          </div>

                          {/* Evidence Upload */}
                          {item.requiresEvidence && (
                            <div className="space-y-3">
                              <label className="block text-sm font-medium text-gray-700">
                                Evidence Upload ({item.evidenceType})
                              </label>
                              <div className="flex items-center space-x-3">
                                <input
                                  ref={(el) => {
                                    fileInputRefs.current[item.id] = el
                                  }}
                                  type="file"
                                  accept={item.evidenceType === 'screenshot' ? 'image/*' : item.evidenceType === 'video' ? 'video/*' : '*/*'}
                                  onChange={(e) => handleFileUpload(item.id, e)}
                                  className="hidden"
                                />
                                <button
                                  type="button"
                                  onClick={() => fileInputRefs.current[item.id]?.click()}
                                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105 shadow-md"
                                >
                                  <DocumentArrowUpIcon className="h-4 w-4" />
                                  <span>Upload Evidence</span>
                                </button>
                                {item.evidence && (
                                  <div className="flex items-center space-x-2 px-3 py-2 bg-green-100 text-green-800 rounded-lg">
                                    <CheckCircleIcon className="h-4 w-4" />
                                    <span className="text-sm font-medium">{item.evidence.name}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Modern Submit Button */}
                <div className="flex justify-end pt-8 border-t border-gray-200">
                  <button
                    type="submit"
                    className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
                  >
                    <div className="flex items-center space-x-2">
                      <SparklesIcon className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                      <span>Submit Checklist</span>
                    </div>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Modern Chat Interface */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 h-full overflow-hidden">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">AI Assistant</h3>
                    <p className="text-blue-100 text-sm">Ask me anything about compliance</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto h-96 p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-3 rounded-2xl text-sm shadow-sm ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                          : 'bg-gray-100 text-gray-900 border border-gray-200'
                      }`}
                    >
                      <p className="leading-relaxed">{message.content}</p>
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Modern Input */}
              <div className="p-6 border-t border-gray-100">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Ask a question about compliance..."
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!userInput.trim()}
                    className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-md"
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
} 
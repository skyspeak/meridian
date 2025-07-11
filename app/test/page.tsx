'use client'

import React from 'react'
import { projectStore } from '../../lib/store'
import Layout from '../../components/Layout'

export default function TestPage() {
  const projects = projectStore.getAllProjects()
  const users = projectStore.getAllUsers()
  const stats = projectStore.getDashboardStats()

  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Meridian Compliance Platform - Test Page</h1>
        
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Dashboard Stats</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(stats, null, 2)}
            </pre>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Users ({users.length})</h2>
            <div className="space-y-2">
              {users.map(user => (
                <div key={user.id} className="flex items-center space-x-4 p-2 bg-gray-50 rounded">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-sm text-gray-600">{user.role}</span>
                  <span className="text-sm text-gray-500">{user.department}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Projects ({projects.length})</h2>
            <div className="space-y-4">
              {projects.map(project => (
                <div key={project.id} className="border border-gray-200 rounded p-4">
                  <h3 className="font-medium">{project.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>Status: {project.status}</span>
                    <span>Stage: {project.stage}</span>
                    <span>Priority: {project.priority}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
} 
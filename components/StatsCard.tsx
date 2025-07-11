import React from 'react'
import { 
  DocumentTextIcon, 
  ClockIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline'

interface StatsCardProps {
  title: string
  value: number
  change: string
  changeType: 'increase' | 'decrease'
  icon: string
}

const iconMap = {
  DocumentTextIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
}

export default function StatsCard({ title, value, change, changeType, icon }: StatsCardProps) {
  const IconComponent = iconMap[icon as keyof typeof iconMap] || DocumentTextIcon

  return (
    <div className="card">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <IconComponent className="h-8 w-8 text-primary-600" />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className="flex items-center">
          {changeType === 'increase' ? (
            <ArrowUpIcon className="h-4 w-4 text-green-500" />
          ) : (
            <ArrowDownIcon className="h-4 w-4 text-red-500" />
          )}
          <span className={`ml-1 text-sm font-medium ${
            changeType === 'increase' ? 'text-green-600' : 'text-red-600'
          }`}>
            {change}
          </span>
        </div>
      </div>
    </div>
  )
} 
import { v4 as uuidv4 } from 'uuid'

export interface AuditLogEntry {
  id: string
  action: string
  description: string
  userId: string
  timestamp: Date
  details?: Record<string, any>
  category: 'monitoring' | 'privacy' | 'compliance' | 'form_submission' | 'chat'
}

class AuditLogService {
  private logs: AuditLogEntry[] = []

  logMonitoringAction(
    action: string,
    description: string,
    userId: string,
    details?: Record<string, any>
  ): AuditLogEntry {
    const entry: AuditLogEntry = {
      id: uuidv4(),
      action,
      description,
      userId,
      timestamp: new Date(),
      details,
      category: 'monitoring'
    }
    
    this.logs.push(entry)
    return entry
  }

  logFormSubmission(
    formName: string,
    userId: string,
    formData: Record<string, any>
  ): AuditLogEntry {
    const entry: AuditLogEntry = {
      id: uuidv4(),
      action: 'form_submitted',
      description: `Monitoring checklist form submitted: ${formName}`,
      userId,
      timestamp: new Date(),
      details: { formName, formData },
      category: 'form_submission'
    }
    
    this.logs.push(entry)
    return entry
  }

  logChatMessage(
    message: string,
    userId: string,
    isUserMessage: boolean
  ): AuditLogEntry {
    const entry: AuditLogEntry = {
      id: uuidv4(),
      action: isUserMessage ? 'chat_message_sent' : 'chat_message_received',
      description: isUserMessage ? 'User sent chat message' : 'Copilot responded to user',
      userId,
      timestamp: new Date(),
      details: { message, isUserMessage },
      category: 'chat'
    }
    
    this.logs.push(entry)
    return entry
  }

  logPrivacyCheckpoint(
    userId: string,
    evidenceType: string,
    fileName?: string
  ): AuditLogEntry {
    const entry: AuditLogEntry = {
      id: uuidv4(),
      action: 'privacy_checkpoint_completed',
      description: `Privacy checkpoint completed with ${evidenceType} evidence`,
      userId,
      timestamp: new Date(),
      details: { evidenceType, fileName },
      category: 'privacy'
    }
    
    this.logs.push(entry)
    return entry
  }

  logComplianceCheck(
    userId: string,
    checkType: string,
    status: 'passed' | 'failed' | 'pending'
  ): AuditLogEntry {
    const entry: AuditLogEntry = {
      id: uuidv4(),
      action: 'compliance_check_performed',
      description: `Compliance check performed: ${checkType} - ${status}`,
      userId,
      timestamp: new Date(),
      details: { checkType, status },
      category: 'compliance'
    }
    
    this.logs.push(entry)
    return entry
  }

  getLogsByCategory(category: AuditLogEntry['category']): AuditLogEntry[] {
    return this.logs.filter(log => log.category === category)
  }

  getLogsByUser(userId: string): AuditLogEntry[] {
    return this.logs.filter(log => log.userId === userId)
  }

  getRecentLogs(limit: number = 50): AuditLogEntry[] {
    return this.logs
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit)
  }

  getAllLogs(): AuditLogEntry[] {
    return [...this.logs]
  }

  clearLogs(): void {
    this.logs = []
  }
}

export const auditLogService = new AuditLogService() 
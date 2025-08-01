export interface User {
  id: string;
  name: string;
  email: string;
  role: 'legal' | 'it' | 'admin' | 'approver';
  department: string;
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  stage: ProjectStage;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  assignedUsers: string[];
  requiredUsers: string[];
  evidence: Evidence[];
  approvals: Approval[];
  auditTrail: AuditEntry[];
  tags: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedCompletion?: Date;
  actualCompletion?: Date;
}

export type ProjectStatus = 'draft' | 'in_review' | 'pending_approval' | 'approved' | 'rejected' | 'completed';

export type ProjectStage = 
  | 'initial_assessment'
  | 'legal_review'
  | 'technical_review'
  | 'compliance_check'
  | 'final_approval'
  | 'implementation'
  | 'monitoring';

export interface Evidence {
  id: string;
  type: 'document' | 'link' | 'screenshot' | 'certification' | 'assessment';
  title: string;
  description: string;
  url?: string;
  filePath?: string;
  uploadedBy: string;
  uploadedAt: Date;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
}

export interface Approval {
  id: string;
  approverId: string;
  stage: ProjectStage;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  requestedAt: Date;
  completedAt?: Date;
  evidence?: string[];
}

export interface AuditEntry {
  id: string;
  action: string;
  description: string;
  userId: string;
  timestamp: Date;
  details?: Record<string, any>;
  stage?: ProjectStage;
}

export interface WorkflowStage {
  id: ProjectStage;
  name: string;
  description: string;
  requiredApprovers: string[];
  requiredEvidence: string[];
  estimatedDuration: number; // in days
  canAdvance: boolean;
  canRevert: boolean;
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  pendingApprovals: number;
  completedThisMonth: number;
  averageCompletionTime: number;
  stageBreakdown: Record<ProjectStage, number>;
}

// Roadmap Builder Types
export interface RoadmapGate {
  id: string;
  name: string;
  description: string;
  order: number;
  estimatedDuration: number; // in days
  dependencies: string[]; // IDs of gates that must be completed first
  requiredResources: string[]; // IDs of required resources
  deliverables: string[];
  successCriteria: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
}

export interface RoadmapCheckpoint {
  id: string;
  gateId: string;
  name: string;
  description: string;
  order: number;
  estimatedDuration: number; // in days
  requiredEvidence: string[];
  approvers: string[]; // User IDs who need to approve
  status: 'pending' | 'approved' | 'rejected' | 'not_started';
}

export interface RoadmapResource {
  id: string;
  name: string;
  role: string;
  department: string;
  expertise: string[];
  availability: 'available' | 'partially_available' | 'unavailable';
  contactInfo: {
    email: string;
    phone?: string;
  };
  estimatedTimeCommitment: number; // hours per week
}

export interface RoadmapPlan {
  id: string;
  projectTitle: string;
  projectDescription: string;
  industry: string;
  complexity: 'simple' | 'moderate' | 'complex' | 'enterprise';
  estimatedTotalDuration: number; // in days
  estimatedBudget: {
    min: number;
    max: number;
    currency: string;
  };
  gates: RoadmapGate[];
  checkpoints: RoadmapCheckpoint[];
  resources: RoadmapResource[];
  risks: string[];
  assumptions: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
} 
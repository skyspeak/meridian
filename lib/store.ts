import { Project, User, WorkflowStage, ProjectStage, AuditEntry } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Mock data - in a real app, this would come from a database
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'legal',
    department: 'Legal',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike.chen@company.com',
    role: 'it',
    department: 'IT',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@company.com',
    role: 'admin',
    department: 'Compliance',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@company.com',
    role: 'approver',
    department: 'Risk Management',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '5',
    name: 'Lisa Wang',
    email: 'lisa.wang@company.com',
    role: 'legal',
    department: 'Legal',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face'
  }
];

export const workflowStages: WorkflowStage[] = [
  {
    id: 'initial_assessment',
    name: 'Initial Assessment',
    description: 'Initial project evaluation and risk assessment',
    requiredApprovers: ['3'], // Emily (admin)
    requiredEvidence: ['project_scope', 'risk_assessment'],
    estimatedDuration: 3,
    canAdvance: true,
    canRevert: false
  },
  {
    id: 'legal_review',
    name: 'Legal Review',
    description: 'Legal compliance and regulatory review',
    requiredApprovers: ['1', '5'], // Sarah and Lisa (legal)
    requiredEvidence: ['legal_opinion', 'regulatory_compliance'],
    estimatedDuration: 5,
    canAdvance: true,
    canRevert: true
  },
  {
    id: 'technical_review',
    name: 'Technical Review',
    description: 'Technical feasibility and security assessment',
    requiredApprovers: ['2'], // Mike (IT)
    requiredEvidence: ['technical_assessment', 'security_review'],
    estimatedDuration: 4,
    canAdvance: true,
    canRevert: true
  },
  {
    id: 'compliance_check',
    name: 'Compliance Check',
    description: 'Final compliance verification',
    requiredApprovers: ['3', '4'], // Emily and David
    requiredEvidence: ['compliance_report', 'final_assessment'],
    estimatedDuration: 3,
    canAdvance: true,
    canRevert: true
  },
  {
    id: 'final_approval',
    name: 'Final Approval',
    description: 'Executive approval and sign-off',
    requiredApprovers: ['4'], // David (approver)
    requiredEvidence: ['executive_approval'],
    estimatedDuration: 2,
    canAdvance: true,
    canRevert: true
  },
  {
    id: 'implementation',
    name: 'Implementation',
    description: 'Project implementation and deployment',
    requiredApprovers: ['2'], // Mike (IT)
    requiredEvidence: ['implementation_plan', 'deployment_report'],
    estimatedDuration: 7,
    canAdvance: true,
    canRevert: false
  },
  {
    id: 'monitoring',
    name: 'Monitoring',
    description: 'Ongoing monitoring and compliance tracking',
    requiredApprovers: ['3'], // Emily (admin)
    requiredEvidence: ['monitoring_report', 'compliance_metrics'],
    estimatedDuration: 30,
    canAdvance: false,
    canRevert: false
  }
];

// In-memory store (in production, this would be a database)
class ProjectStore {
  private projects: Project[] = [];
  private users: User[] = mockUsers;

  constructor() {
    // Initialize with some sample projects
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleProjects: Project[] = [
      {
        id: '1',
        name: 'AI-Powered Customer Service Bot',
        description: 'Implementation of an AI chatbot for customer service automation',
        status: 'in_review',
        stage: 'legal_review',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20'),
        createdBy: '2',
        assignedUsers: ['2', '1'],
        requiredUsers: ['1', '3'],
        evidence: [
          {
            id: '1',
            type: 'document',
            title: 'Project Scope Document',
            description: 'Detailed project scope and requirements',
            uploadedBy: '2',
            uploadedAt: new Date('2024-01-15'),
            verified: true,
            verifiedBy: '3',
            verifiedAt: new Date('2024-01-16')
          }
        ],
        approvals: [
          {
            id: '1',
            approverId: '3',
            stage: 'initial_assessment',
            status: 'approved',
            requestedAt: new Date('2024-01-15'),
            completedAt: new Date('2024-01-16')
          }
        ],
        auditTrail: [
          {
            id: '1',
            action: 'project_created',
            description: 'Project created by Mike Chen',
            userId: '2',
            timestamp: new Date('2024-01-15')
          },
          {
            id: '2',
            action: 'stage_advanced',
            description: 'Project advanced to Legal Review',
            userId: '3',
            timestamp: new Date('2024-01-16'),
            stage: 'legal_review'
          }
        ],
        tags: ['AI', 'Customer Service', 'Automation'],
        priority: 'high'
      },
      {
        id: '2',
        name: 'Data Analytics Platform',
        description: 'Enterprise data analytics platform with ML capabilities',
        status: 'pending_approval',
        stage: 'compliance_check',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-18'),
        createdBy: '2',
        assignedUsers: ['2', '4'],
        requiredUsers: ['1', '3', '4'],
        evidence: [
          {
            id: '2',
            type: 'document',
            title: 'Technical Architecture',
            description: 'Technical architecture and security assessment',
            uploadedBy: '2',
            uploadedAt: new Date('2024-01-12'),
            verified: true,
            verifiedBy: '3',
            verifiedAt: new Date('2024-01-13')
          }
        ],
        approvals: [
          {
            id: '2',
            approverId: '3',
            stage: 'initial_assessment',
            status: 'approved',
            requestedAt: new Date('2024-01-10'),
            completedAt: new Date('2024-01-11')
          },
          {
            id: '3',
            approverId: '1',
            stage: 'legal_review',
            status: 'approved',
            requestedAt: new Date('2024-01-11'),
            completedAt: new Date('2024-01-14')
          },
          {
            id: '4',
            approverId: '2',
            stage: 'technical_review',
            status: 'approved',
            requestedAt: new Date('2024-01-14'),
            completedAt: new Date('2024-01-17')
          }
        ],
        auditTrail: [
          {
            id: '3',
            action: 'project_created',
            description: 'Project created by Mike Chen',
            userId: '2',
            timestamp: new Date('2024-01-10')
          }
        ],
        tags: ['Analytics', 'ML', 'Data'],
        priority: 'critical'
      }
    ];

    this.projects = sampleProjects;
  }

  // Project methods
  getAllProjects(): Project[] {
    return [...this.projects];
  }

  getProjectById(id: string): Project | undefined {
    return this.projects.find(p => p.id === id);
  }

  createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'auditTrail'>): Project {
    const project: Project = {
      ...projectData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      auditTrail: [{
        id: uuidv4(),
        action: 'project_created',
        description: `Project created by ${this.getUserById(projectData.createdBy)?.name || 'Unknown'}`,
        userId: projectData.createdBy,
        timestamp: new Date()
      }]
    };

    this.projects.push(project);
    return project;
  }

  updateProject(id: string, updates: Partial<Project>): Project | null {
    const index = this.projects.findIndex(p => p.id === id);
    if (index === -1) return null;

    const updatedProject = {
      ...this.projects[index],
      ...updates,
      updatedAt: new Date()
    };

    this.projects[index] = updatedProject;
    return updatedProject;
  }

  advanceProjectStage(projectId: string, newStage: ProjectStage, userId: string): Project | null {
    const project = this.getProjectById(projectId);
    if (!project) return null;

    const auditEntry: AuditEntry = {
      id: uuidv4(),
      action: 'stage_advanced',
      description: `Project advanced to ${newStage.replace('_', ' ')}`,
      userId,
      timestamp: new Date(),
      stage: newStage
    };

    return this.updateProject(projectId, {
      stage: newStage,
      auditTrail: [...project.auditTrail, auditEntry]
    });
  }

  // User methods
  getAllUsers(): User[] {
    return [...this.users];
  }

  getUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  getUsersByRole(role: User['role']): User[] {
    return this.users.filter(u => u.role === role);
  }

  // Workflow methods
  getWorkflowStages(): WorkflowStage[] {
    return [...workflowStages];
  }

  getCurrentStage(projectId: string): WorkflowStage | undefined {
    const project = this.getProjectById(projectId);
    if (!project) return undefined;
    return workflowStages.find(stage => stage.id === project.stage);
  }

  getNextStage(projectId: string): WorkflowStage | undefined {
    const project = this.getProjectById(projectId);
    if (!project) return undefined;
    
    const currentIndex = workflowStages.findIndex(stage => stage.id === project.stage);
    if (currentIndex === -1 || currentIndex === workflowStages.length - 1) return undefined;
    
    return workflowStages[currentIndex + 1];
  }

  // Dashboard stats
  getDashboardStats(): any {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const totalProjects = this.projects.length;
    const activeProjects = this.projects.filter(p => 
      ['draft', 'in_review', 'pending_approval'].includes(p.status)
    ).length;
    const pendingApprovals = this.projects.filter(p => p.status === 'pending_approval').length;
    const completedThisMonth = this.projects.filter(p => 
      p.status === 'completed' && p.actualCompletion && p.actualCompletion >= thisMonth
    ).length;

    const stageBreakdown = workflowStages.reduce((acc, stage) => {
      acc[stage.id] = this.projects.filter(p => p.stage === stage.id).length;
      return acc;
    }, {} as Record<ProjectStage, number>);

    return {
      totalProjects,
      activeProjects,
      pendingApprovals,
      completedThisMonth,
      stageBreakdown
    };
  }
}

export const projectStore = new ProjectStore(); 
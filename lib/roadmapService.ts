import { RoadmapPlan, RoadmapGate, RoadmapCheckpoint, RoadmapResource } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Mock AI service for roadmap generation
// In a real implementation, this would call an AI service like OpenAI
export class RoadmapService {
  private static readonly INDUSTRY_TEMPLATES = {
    'pharmaceutical': {
      gates: [
        {
          name: 'Pre-Clinical Research',
          description: 'Initial research and laboratory testing',
          estimatedDuration: 180,
          deliverables: ['Research proposal', 'Laboratory protocols', 'Initial findings'],
          successCriteria: ['Research objectives defined', 'Laboratory setup complete', 'Initial data collected'],
          riskLevel: 'high' as const
        },
        {
          name: 'Regulatory Planning',
          description: 'FDA and regulatory compliance planning',
          estimatedDuration: 90,
          deliverables: ['Regulatory strategy', 'Compliance documentation', 'FDA communication plan'],
          successCriteria: ['Regulatory pathway identified', 'Documentation framework established', 'FDA pre-submission meeting scheduled'],
          riskLevel: 'critical' as const
        },
        {
          name: 'Clinical Trial Design',
          description: 'Design and planning of clinical trials',
          estimatedDuration: 120,
          deliverables: ['Clinical trial protocol', 'Patient recruitment plan', 'Data collection framework'],
          successCriteria: ['Protocol approved by IRB', 'Recruitment strategy finalized', 'Data management plan established'],
          riskLevel: 'high' as const
        },
        {
          name: 'Manufacturing Setup',
          description: 'Drug manufacturing and quality control setup',
          estimatedDuration: 150,
          deliverables: ['Manufacturing facility design', 'Quality control protocols', 'Supply chain setup'],
          successCriteria: ['Facility approved by FDA', 'Quality systems in place', 'Supply chain established'],
          riskLevel: 'critical' as const
        },
        {
          name: 'Clinical Trials',
          description: 'Phase I, II, and III clinical trials',
          estimatedDuration: 720,
          deliverables: ['Clinical trial reports', 'Safety data', 'Efficacy data'],
          successCriteria: ['All trial phases completed', 'Safety profile established', 'Efficacy demonstrated'],
          riskLevel: 'critical' as const
        },
        {
          name: 'FDA Submission',
          description: 'New Drug Application (NDA) submission',
          estimatedDuration: 60,
          deliverables: ['NDA application', 'Supporting documentation', 'FDA review materials'],
          successCriteria: ['NDA submitted', 'All documentation complete', 'FDA review initiated'],
          riskLevel: 'critical' as const
        },
        {
          name: 'FDA Review and Approval',
          description: 'FDA review process and final approval',
          estimatedDuration: 365,
          deliverables: ['FDA approval letter', 'Labeling approved', 'Post-marketing plan'],
          successCriteria: ['FDA approval received', 'Labeling finalized', 'Post-marketing requirements defined'],
          riskLevel: 'critical' as const
        },
        {
          name: 'Commercial Launch',
          description: 'Market launch and commercialization',
          estimatedDuration: 90,
          deliverables: ['Marketing strategy', 'Sales team training', 'Distribution network'],
          successCriteria: ['Product launched', 'Sales targets met', 'Distribution established'],
          riskLevel: 'medium' as const
        }
      ],
      resources: [
        {
          name: 'Dr. Sarah Johnson',
          role: 'Principal Investigator',
          department: 'Research & Development',
          expertise: ['Clinical Research', 'Regulatory Affairs', 'Drug Development'],
          availability: 'available' as const,
          contactInfo: { email: 'sarah.johnson@company.com' },
          estimatedTimeCommitment: 40
        },
        {
          name: 'Dr. Michael Chen',
          role: 'Regulatory Affairs Director',
          department: 'Regulatory Affairs',
          expertise: ['FDA Regulations', 'NDA Submissions', 'Compliance'],
          availability: 'available' as const,
          contactInfo: { email: 'michael.chen@company.com' },
          estimatedTimeCommitment: 35
        },
        {
          name: 'Emily Rodriguez',
          role: 'Clinical Operations Manager',
          department: 'Clinical Operations',
          expertise: ['Clinical Trial Management', 'Patient Recruitment', 'Data Management'],
          availability: 'partially_available' as const,
          contactInfo: { email: 'emily.rodriguez@company.com' },
          estimatedTimeCommitment: 30
        },
        {
          name: 'David Kim',
          role: 'Manufacturing Director',
          department: 'Manufacturing',
          expertise: ['GMP Manufacturing', 'Quality Control', 'Supply Chain'],
          availability: 'available' as const,
          contactInfo: { email: 'david.kim@company.com' },
          estimatedTimeCommitment: 40
        },
        {
          name: 'Lisa Wang',
          role: 'Legal Counsel',
          department: 'Legal',
          expertise: ['Intellectual Property', 'Regulatory Law', 'Contract Negotiation'],
          availability: 'available' as const,
          contactInfo: { email: 'lisa.wang@company.com' },
          estimatedTimeCommitment: 25
        }
      ]
    },
    'technology': {
      gates: [
        {
          name: 'Market Research',
          description: 'Market analysis and user research',
          estimatedDuration: 30,
          deliverables: ['Market analysis report', 'User personas', 'Competitive analysis'],
          successCriteria: ['Target market identified', 'User needs understood', 'Competitive landscape mapped'],
          riskLevel: 'low' as const
        },
        {
          name: 'Product Design',
          description: 'Product design and prototyping',
          estimatedDuration: 60,
          deliverables: ['Product specifications', 'UI/UX designs', 'Prototype'],
          successCriteria: ['Product specs finalized', 'Designs approved', 'Prototype tested'],
          riskLevel: 'medium' as const
        },
        {
          name: 'Development',
          description: 'Software development and testing',
          estimatedDuration: 120,
          deliverables: ['MVP', 'Test results', 'Documentation'],
          successCriteria: ['MVP completed', 'Testing passed', 'Documentation complete'],
          riskLevel: 'high' as const
        },
        {
          name: 'Security Review',
          description: 'Security assessment and compliance',
          estimatedDuration: 45,
          deliverables: ['Security audit report', 'Compliance documentation', 'Penetration testing'],
          successCriteria: ['Security audit passed', 'Compliance verified', 'Vulnerabilities addressed'],
          riskLevel: 'critical' as const
        },
        {
          name: 'Beta Testing',
          description: 'Beta testing and user feedback',
          estimatedDuration: 60,
          deliverables: ['Beta test results', 'User feedback report', 'Bug fixes'],
          successCriteria: ['Beta testing completed', 'Feedback collected', 'Critical bugs fixed'],
          riskLevel: 'medium' as const
        },
        {
          name: 'Launch Preparation',
          description: 'Final launch preparation',
          estimatedDuration: 30,
          deliverables: ['Launch plan', 'Marketing materials', 'Support documentation'],
          successCriteria: ['Launch plan approved', 'Marketing ready', 'Support team trained'],
          riskLevel: 'medium' as const
        },
        {
          name: 'Product Launch',
          description: 'Product launch and monitoring',
          estimatedDuration: 90,
          deliverables: ['Launched product', 'Performance metrics', 'User adoption data'],
          successCriteria: ['Product launched', 'Performance targets met', 'User adoption achieved'],
          riskLevel: 'high' as const
        }
      ],
      resources: [
        {
          name: 'Mike Chen',
          role: 'Product Manager',
          department: 'Product',
          expertise: ['Product Strategy', 'User Research', 'Agile Development'],
          availability: 'available' as const,
          contactInfo: { email: 'mike.chen@company.com' },
          estimatedTimeCommitment: 40
        },
        {
          name: 'Sarah Johnson',
          role: 'Lead Developer',
          department: 'Engineering',
          expertise: ['Full-Stack Development', 'System Architecture', 'DevOps'],
          availability: 'available' as const,
          contactInfo: { email: 'sarah.johnson@company.com' },
          estimatedTimeCommitment: 40
        },
        {
          name: 'Emily Rodriguez',
          role: 'Security Engineer',
          department: 'Security',
          expertise: ['Security Auditing', 'Compliance', 'Penetration Testing'],
          availability: 'partially_available' as const,
          contactInfo: { email: 'emily.rodriguez@company.com' },
          estimatedTimeCommitment: 30
        },
        {
          name: 'David Kim',
          role: 'UX Designer',
          department: 'Design',
          expertise: ['User Experience', 'Interface Design', 'User Research'],
          availability: 'available' as const,
          contactInfo: { email: 'david.kim@company.com' },
          estimatedTimeCommitment: 35
        },
        {
          name: 'Lisa Wang',
          role: 'QA Engineer',
          department: 'Quality Assurance',
          expertise: ['Test Automation', 'Manual Testing', 'Quality Processes'],
          availability: 'available' as const,
          contactInfo: { email: 'lisa.wang@company.com' },
          estimatedTimeCommitment: 40
        }
      ]
    }
  };

  static async generateRoadmap(
    projectDescription: string,
    industry: string = 'technology'
  ): Promise<RoadmapPlan> {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    const template = this.INDUSTRY_TEMPLATES[industry as keyof typeof this.INDUSTRY_TEMPLATES] || 
                   this.INDUSTRY_TEMPLATES.technology;

    const gates: RoadmapGate[] = template.gates.map((gate, index) => ({
      id: uuidv4(),
      name: gate.name,
      description: gate.description,
      order: index + 1,
      estimatedDuration: gate.estimatedDuration,
      dependencies: index > 0 ? [template.gates[index - 1].name] : [],
      requiredResources: [],
      deliverables: gate.deliverables,
      successCriteria: gate.successCriteria,
      riskLevel: gate.riskLevel,
      status: 'not_started'
    }));

    const checkpoints: RoadmapCheckpoint[] = gates.flatMap(gate => 
      gate.deliverables.map((deliverable, index) => ({
        id: uuidv4(),
        gateId: gate.id,
        name: `${gate.name} - ${deliverable}`,
        description: `Checkpoint for ${deliverable}`,
        order: index + 1,
        estimatedDuration: Math.ceil(gate.estimatedDuration / gate.deliverables.length),
        requiredEvidence: [deliverable],
        approvers: [],
        status: 'not_started'
      }))
    );

    const resources: RoadmapResource[] = template.resources.map(resource => ({
      id: uuidv4(),
      name: resource.name,
      role: resource.role,
      department: resource.department,
      expertise: resource.expertise,
      availability: resource.availability,
      contactInfo: resource.contactInfo,
      estimatedTimeCommitment: resource.estimatedTimeCommitment
    }));

    const totalDuration = gates.reduce((sum, gate) => sum + gate.estimatedDuration, 0);
    const complexity = this.assessComplexity(projectDescription, totalDuration);

    return {
      id: uuidv4(),
      projectTitle: this.extractProjectTitle(projectDescription),
      projectDescription,
      industry,
      complexity,
      estimatedTotalDuration: totalDuration,
      estimatedBudget: this.estimateBudget(complexity, totalDuration),
      gates,
      checkpoints,
      resources,
      risks: this.generateRisks(industry, complexity),
      assumptions: this.generateAssumptions(industry),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'current-user'
    };
  }

  private static extractProjectTitle(description: string): string {
    // Simple title extraction - in a real AI implementation, this would be more sophisticated
    const words = description.split(' ');
    return words.slice(0, 5).join(' ') + (words.length > 5 ? '...' : '');
  }

  private static assessComplexity(description: string, duration: number): 'simple' | 'moderate' | 'complex' | 'enterprise' {
    const wordCount = description.split(' ').length;
    const hasComplexKeywords = /drug|clinical|fda|regulatory|ai|ml|machine learning|artificial intelligence/i.test(description);
    
    if (duration > 365 || hasComplexKeywords) return 'enterprise';
    if (duration > 180 || wordCount > 50) return 'complex';
    if (duration > 90 || wordCount > 30) return 'moderate';
    return 'simple';
  }

  private static estimateBudget(complexity: string, duration: number): { min: number; max: number; currency: string } {
    const dailyRates = {
      simple: { min: 500, max: 1000 },
      moderate: { min: 1000, max: 2000 },
      complex: { min: 2000, max: 5000 },
      enterprise: { min: 5000, max: 15000 }
    };

    const rate = dailyRates[complexity as keyof typeof dailyRates];
    return {
      min: rate.min * duration,
      max: rate.max * duration,
      currency: 'USD'
    };
  }

  private static generateRisks(industry: string, complexity: string): string[] {
    const commonRisks = [
      'Resource availability and team capacity',
      'Timeline delays due to dependencies',
      'Budget overruns and scope creep',
      'Technical challenges and integration issues'
    ];

    const industryRisks = {
      pharmaceutical: [
        'Regulatory approval delays',
        'Clinical trial recruitment challenges',
        'Manufacturing compliance issues',
        'Patent and intellectual property risks'
      ],
      technology: [
        'Security vulnerabilities and data breaches',
        'User adoption and market acceptance',
        'Technology stack obsolescence',
        'Competitive pressure and market changes'
      ]
    };

    const complexityRisks = {
      enterprise: [
        'Stakeholder alignment and communication',
        'Cross-functional coordination challenges',
        'Risk of project failure due to scale'
      ],
      complex: [
        'Technical complexity and integration challenges',
        'Resource allocation and skill gaps'
      ]
    };

    return [
      ...commonRisks,
      ...(industryRisks[industry as keyof typeof industryRisks] || []),
      ...(complexityRisks[complexity as keyof typeof complexityRisks] || [])
    ];
  }

  private static generateAssumptions(industry: string): string[] {
    const commonAssumptions = [
      'Adequate budget and resources will be available',
      'Stakeholder support and commitment will be maintained',
      'Technology and tools will function as expected'
    ];

    const industryAssumptions = {
      pharmaceutical: [
        'Regulatory environment remains stable',
        'Clinical trial sites will be available',
        'Patient recruitment targets will be met'
      ],
      technology: [
        'User requirements will remain stable',
        'Technology stack will remain relevant',
        'Market conditions will be favorable'
      ]
    };

    return [
      ...commonAssumptions,
      ...(industryAssumptions[industry as keyof typeof industryAssumptions] || [])
    ];
  }
} 
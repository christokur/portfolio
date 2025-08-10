export interface CareerData {
  career_summary: {
    current_role: string;
    company: string;
    duration: string;
    location: string;
    elevator_pitch: string;
  };
  platform_transformation: {
    before: {
      clusters: number;
      deployment_method: string;
      environment_creation_time: string;
      aws_accounts: number;
    };
    after: {
      clusters: number;
      deployment_method: string;
      environment_creation_time: string;
      aws_accounts: number;
      peak_clusters: number;
      peak_accounts: number;
    };
  };
  technical_achievements: {
    b2b_cli: {
      description: string;
      lines_of_code: number;
      language: string;
      framework: string;
      key_features: string[];
    };
    infrastructure_architecture: {
      codename: string;
      design_pattern: string;
      problem_solved: string;
      key_innovations: Array<{
        description: string;
        benefit: string;
        timeline: string;
      }>;
    };
    self_healing_system: {
      name: string;
      total_fixers: number;
      configuration: string;
    };
  };
  metrics_and_impact: {
    scale: {
      clusters: string;
      aws_accounts: string;
      developers_supported: string;
    };
    efficiency: {
      environment_creation: string;
      deployment_process: string;
      platform_engineer_productivity: string;
    };
    reliability: {
      self_healing_patterns: number;
    };
  };
}

export interface TimelineEvent {
  period: string;
  event: string;
  achievements: string[];
  details?: string;
}

export interface CareerTimeline {
  career_overview: {
    total_experience: string;
    current_role: string;
    current_company: string;
    primary_focus: string;
  };
  companies: Array<{
    company: string;
    duration: string;
    role: string;
    focus: string;
    detail_level: string;
    data_location: string;
  }>;
}
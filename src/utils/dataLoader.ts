import { CareerData, TimelineEvent, CareerTimeline } from "../types";
import * as yaml from 'js-yaml';

// Import data files as text (these will be copied by sync script)
import masterDataYaml from "../../data/master-data.yaml?raw";
import timelineJson from "../../data/timeline.json?raw";
import careerTimelineJson from "../../data/career-timeline.json?raw";
export const loadMasterData = (): CareerData => {
  // Parse the actual YAML data
  const yamlData = yaml.load(masterDataYaml as string) as any;

  // Debug logging
  console.log('Lines of code from YAML:', yamlData.technical_achievements?.b2b_cli?.lines_of_code);
  console.log('Peak clusters:', yamlData.platform_transformation?.after?.peak_clusters);

  return {
    career_summary: {
      current_role: yamlData.career_summary.current_role,
      company: yamlData.career_summary.company,
      duration: yamlData.career_summary.duration,
      location: yamlData.career_summary.location,
      elevator_pitch: yamlData.career_summary.elevator_pitch
    },
    platform_transformation: {
      before: {
        clusters: yamlData.platform_transformation.before.clusters,
        deployment_method: yamlData.platform_transformation.before.deployment_method,
        environment_creation_time: yamlData.platform_transformation.before.environment_creation_time,
        aws_accounts: yamlData.platform_transformation.before.aws_accounts
      },
      after: {
        clusters: yamlData.platform_transformation.after.clusters,
        deployment_method: yamlData.platform_transformation.after.deployment_method,
        environment_creation_time: yamlData.platform_transformation.after.environment_creation_time,
        aws_accounts: yamlData.platform_transformation.after.aws_accounts,
        peak_clusters: yamlData.platform_transformation.after.peak_clusters,
        peak_accounts: yamlData.platform_transformation.after.peak_accounts
      }
    },
    technical_achievements: {
      b2b_cli: {
        description: yamlData.technical_achievements.b2b_cli.description,
        lines_of_code: yamlData.technical_achievements.b2b_cli.lines_of_code,
        language: yamlData.technical_achievements.b2b_cli.language,
        framework: yamlData.technical_achievements.b2b_cli.framework,
        key_features: yamlData.technical_achievements.b2b_cli.key_features
      },
      infrastructure_architecture: {
        codename: yamlData.technical_achievements.infrastructure_architecture.codename,
        design_pattern: yamlData.technical_achievements.infrastructure_architecture.design_pattern,
        problem_solved: yamlData.technical_achievements.infrastructure_architecture.problem_solved,
        key_innovations: yamlData.technical_achievements.infrastructure_architecture.key_innovations
      },
      self_healing_system: {
        name: yamlData.self_healing_system.name,
        total_fixers: yamlData.self_healing_system.total_fixers,
        configuration: yamlData.self_healing_system.configuration
      }
    },
    metrics_and_impact: {
      scale: {
        clusters: yamlData.platform_transformation.after.peak_clusters,
        aws_accounts: yamlData.platform_transformation.after.peak_accounts,
        developers_supported: yamlData.platform_transformation.scale.developers_supported,
      },
      efficiency: {
        environment_creation: yamlData.technical_achievements.metrics_and_impact.efficiency.environment_creation,
        deployment_process: yamlData.technical_achievements.metrics_and_impact.efficiency.deployment_process,
        platform_engineer_productivity: yamlData.technical_achievements.metrics_and_impact.efficiency.platform_engineer_productivity
      },
      reliability: {
        self_healing_patterns: yamlData.self_healing_system.total_fixers
      }
    }
  };
};

export const loadTimeline = (): TimelineEvent[] => {
  // Parse the actual JSON data
  const timelineData = JSON.parse(timelineJson as string);

  return timelineData.career_timeline.map((item: any) => ({
    period: item.period,
    event: item.event,
    achievements: item.achievements || (item.state ? [item.state] : [])
  }));
};

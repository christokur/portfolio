import React, { useState } from 'react'
import { loadMasterData } from '../utils/dataLoader'

const MetricsSection: React.FC = () => {
  const [data] = useState(() => loadMasterData())
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null)

  const metricCategories = [
    {
      title: 'Scale',
      color: 'var(--primary)',
      metrics: [
        { label: 'EKS Clusters', value: data.metrics_and_impact.scale.clusters },
        { label: 'AWS Accounts', value: data.metrics_and_impact.scale.aws_accounts },
        { label: 'Developers Supported', value: data.metrics_and_impact.scale.developers_supported },
      ]
    },
    {
      title: 'Efficiency',
      color: 'var(--success)',
      metrics: [
        { label: 'Environment Creation', value: data.metrics_and_impact.efficiency.environment_creation },
        { label: 'Deployment Process', value: data.metrics_and_impact.efficiency.deployment_process },
        { label: 'Platform Productivity', value: data.metrics_and_impact.efficiency.platform_engineer_productivity },
      ]
    },
    {
      title: 'Innovation',
      color: 'var(--accent)',
      metrics: [
        { label: 'Platform Code Lines', value: `${(data.technical_achievements.b2b_cli.lines_of_code / 1000).toFixed(0)}k` },
        { label: 'Self-Healing Patterns', value: data.metrics_and_impact.reliability.self_healing_patterns.toString() },
        { label: 'Architecture', value: 'GreenPrint HA/DR' },
      ]
    }
  ]

  return (
    <section id="metrics" style={{
      padding: '5rem 2rem',
      background: 'rgba(255, 255, 255, 0.02)',
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h2 className="gradient-text" style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '4rem',
        }}>
          Impact & Scale
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '3rem',
        }}>
          {metricCategories.map((category, index) => (
            <div
              key={index}
              className="glass"
              style={{
                padding: '3rem 2rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s',
                transform: selectedMetric === category.title ? 'scale(1.05)' : 'scale(1)',
              }}
              onClick={() => setSelectedMetric(selectedMetric === category.title ? null : category.title)}
              onMouseEnter={(e) => {
                if (selectedMetric !== category.title) {
                  e.currentTarget.style.transform = 'scale(1.02)'
                }
              }}
              onMouseLeave={(e) => {
                if (selectedMetric !== category.title) {
                  e.currentTarget.style.transform = 'scale(1)'
                }
              }}
            >
              <div style={{
                fontSize: '1.5rem',
                color: category.color,
                marginBottom: '2rem',
                fontWeight: 'bold',
              }}>
                {category.title}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {category.metrics.map((metric, metricIndex) => (
                  <div key={metricIndex}>
                    <div style={{
                      fontSize: selectedMetric === category.title ? '1.8rem' : '1.5rem',
                      fontWeight: 'bold',
                      color: 'var(--light)',
                      marginBottom: '0.5rem',
                      transition: 'all 0.3s',
                    }}>
                      {metric.value}
                    </div>
                    <div style={{
                      color: 'var(--text)',
                      fontSize: selectedMetric === category.title ? '1rem' : '0.9rem',
                      transition: 'all 0.3s',
                    }}>
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MetricsSection
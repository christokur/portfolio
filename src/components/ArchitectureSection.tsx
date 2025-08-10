import React, { useState } from 'react'
import { loadMasterData } from '../utils/dataLoader'

const ArchitectureSection: React.FC = () => {
  const [data] = useState(() => loadMasterData())
  const [selectedCard, setSelectedCard] = useState<number | null>(null)

  const architectureCards = [
    {
      icon: "🧠",
      title: "B2B Platform CLI",
      description: `${(data.technical_achievements.b2b_cli.lines_of_code / 1000).toFixed(0)}k-line Python orchestration tool with ${data.technical_achievements.self_healing_system.total_fixers} self-healing patterns`,
      metrics: [`${(data.technical_achievements.b2b_cli.lines_of_code / 1000).toFixed(0)}k Lines`, "12 SDKs", `${data.technical_achievements.self_healing_system.total_fixers} Fixers`]
    },
    {
      icon: "🏗️",
      title: "GreenPrint Architecture",
      description: "Loosely coupled Terraform stacks with HA/DR across regions",
      metrics: ["Primary/Secondary", "Blue-Green", "Zero Downtime"]
    },
    {
      icon: "🧱",
      title: "Bricks Configuration",
      description: "LEGO-like composable blocks eliminating config drift",
      metrics: ["100+ Bricks", "Zero Drift", "Environment Parity"]
    },
    {
      icon: "🔄",
      title: "GitOps Automation",
      description: "Single YAML file changes trigger full environment deployments",
      metrics: ["Single File", "Full Stack", "Automated"]
    },
    {
      icon: "🛡️",
      title: "Security & OIDC",
      description: "Eliminated static credentials with GitHub Actions OIDC",
      metrics: ["No Static Keys", "Temp Credentials", "Granular Access"]
    },
    {
      icon: "📊",
      title: "Self-Healing System",
      description: "Automated recovery patterns for common infrastructure failures",
      metrics: [`${data.technical_achievements.self_healing_system.total_fixers} Patterns`, "93% Less Manual", "Auto Recovery"]
    }
  ];

  return (
    <section id="architecture" style={{
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
          Platform Architecture
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem',
        }}>
          {architectureCards.map((card, index) => (
            <div
              key={index}
              className="glass"
              style={{
                padding: '2rem',
                textAlign: 'center',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s',
                transform: selectedCard === index ? 'scale(1.03)' : 'scale(1)',
              }}
              onClick={() => setSelectedCard(selectedCard === index ? null : index)}
              onMouseEnter={(e) => {
                if (selectedCard !== index) {
                  e.currentTarget.style.transform = 'scale(1.02)'
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCard !== index) {
                  e.currentTarget.style.transform = 'scale(1)'
                }
              }}
            >
              {/* Top accent line */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, var(--primary), var(--accent))',
              }} />

              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                {card.icon}
              </div>

              <h3 style={{
                fontSize: '1.5rem',
                marginBottom: '1rem',
                color: 'var(--primary)',
                fontWeight: 'bold',
              }}>
                {card.title}
              </h3>

              <p style={{
                color: 'var(--text)',
                lineHeight: '1.6',
                marginBottom: '1.5rem',
                fontSize: '1rem',
              }}>
                {card.description}
              </p>

              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '0.5rem',
                flexWrap: 'wrap',
              }}>
                {card.metrics.map((metric, metricIndex) => (
                  <span
                    key={metricIndex}
                    style={{
                      background: 'rgba(14, 165, 233, 0.2)',
                      color: 'var(--primary)',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                    }}
                  >
                    {metric}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ArchitectureSection
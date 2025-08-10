import React, { useState, useEffect } from 'react'
import { loadMasterData } from '../utils/dataLoader'

const HeroSection: React.FC = () => {
  const [data] = useState(() => loadMasterData())
  const [animatedStats, setAnimatedStats] = useState({
    clusters: 0,
    linesOfCode: 0,
    fixers: 0,
    accounts: 0,
  })

  useEffect(() => {
    const targets = {
      clusters: data.platform_transformation.after.peak_clusters,
      linesOfCode: data.technical_achievements.b2b_cli.lines_of_code,
      fixers: data.technical_achievements.self_healing_system?.total_fixers || 31,
      accounts: data.platform_transformation.after.peak_accounts,
    }

    const duration = 2000 // 2 seconds
    const steps = 60
    const stepDuration = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const progress = Math.min(currentStep / steps, 1)

      setAnimatedStats({
        clusters: Math.floor(progress * targets.clusters),
        linesOfCode: Math.floor(progress * targets.linesOfCode),
        fixers: Math.floor(progress * targets.fixers),
        accounts: Math.floor(progress * targets.accounts),
      })

      if (progress === 1) {
        clearInterval(timer)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [data])

  const formatNumber = (num: number): string => {
    if (num >= data.technical_achievements.b2b_cli.lines_of_code) return (num / 1000).toFixed(0) + 'k'
    return num.toLocaleString()
  }

  return (
    <section id="hero" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        maxWidth: '1200px',
        textAlign: 'center',
        zIndex: 10,
        position: 'relative',
      }}>
        <h1 className="gradient-text" style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          marginBottom: '1rem',
          fontWeight: 'bold',
        }}>
          Platform Engineering at Scale
        </h1>

        <h2 style={{
          fontSize: '1.5rem',
          color: 'var(--text)',
          marginBottom: '2rem',
          fontWeight: '400',
        }}>
          Transforming Infrastructure from 1 to 67 Clusters
        </h2>

        <div style={{
          maxWidth: '800px',
          margin: '0 auto 4rem auto',
        }}>
          <p style={{
            fontSize: '1.2rem',
            color: 'var(--text)',
            lineHeight: '1.6',
          }}>
            {data.career_summary.elevator_pitch}
          </p>
        </div>

        {/* Key Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          width: '100%',
          maxWidth: '1000px',
          margin: '0 auto',
        }}>
          {/* Clusters */}
          <div className="glass" style={{
            padding: '2rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)'
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(14, 165, 233, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}>
            <div className="gradient-text" style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem',
            }}>
              {animatedStats.clusters}
            </div>
            <div style={{ color: 'var(--text)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              EKS Clusters
            </div>
            <div style={{ color: 'var(--success)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              ↑ 6,700%
            </div>
          </div>

          {/* Lines of Code */}
          <div className="glass" style={{
            padding: '2rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)'
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(14, 165, 233, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}>
            <div className="gradient-text" style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem',
            }}>
              {formatNumber(animatedStats.linesOfCode)}
            </div>
            <div style={{ color: 'var(--text)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Lines of Code
            </div>
            <div style={{ color: 'var(--success)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Platform CLI
            </div>
          </div>

          {/* Self-Healing */}
          <div className="glass" style={{
            padding: '2rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)'
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(14, 165, 233, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}>
            <div className="gradient-text" style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem',
            }}>
              {animatedStats.fixers}
            </div>
            <div style={{ color: 'var(--text)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Self-Healing Patterns
            </div>
            <div style={{ color: 'var(--success)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              93% Less Manual Work
            </div>
          </div>

          {/* AWS Accounts */}
          <div className="glass" style={{
            padding: '2rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)'
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(14, 165, 233, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}>
            <div className="gradient-text" style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem',
            }}>
              {animatedStats.accounts}
            </div>
            <div style={{ color: 'var(--text)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              AWS Accounts
            </div>
            <div style={{ color: 'var(--success)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Multi-Account Scale
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
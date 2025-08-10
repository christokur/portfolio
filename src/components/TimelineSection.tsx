import React, { useState } from 'react'
import { loadTimeline } from '../utils/dataLoader'

const TimelineSection: React.FC = () => {
  const [timeline] = useState(() => loadTimeline())
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null)

  return (
    <section id="timeline" style={{
      padding: '5rem 2rem',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 className="gradient-text" style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '4rem',
        }}>
          Platform Evolution Journey
        </h2>

        <div style={{ position: 'relative' }}>
          {/* Timeline Line */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: '2px',
            background: 'linear-gradient(180deg, var(--primary), var(--accent))',
            transform: 'translateX(-50%)',
            zIndex: 1,
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {timeline.map((event, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                zIndex: 2,
              }}>
                {/* Timeline Dot */}
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  width: '20px',
                  height: '20px',
                  background: 'var(--primary)',
                  borderRadius: '50%',
                  transform: 'translateX(-50%)',
                  border: '4px solid var(--dark)',
                  zIndex: 3,
                }} />

                {/* Content Card */}
                <div
                  className="glass"
                  style={{
                    width: '45%',
                    marginLeft: index % 2 === 0 ? '0' : '55%',
                    padding: '2rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    transform: selectedEvent === index ? 'scale(1.02)' : 'scale(1)',
                  }}
                  onClick={() => setSelectedEvent(selectedEvent === index ? null : index)}
                  onMouseEnter={(e) => {
                    if (selectedEvent !== index) {
                      e.currentTarget.style.transform = 'scale(1.01)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedEvent !== index) {
                      e.currentTarget.style.transform = 'scale(1)'
                    }
                  }}
                >
                  <div style={{
                    color: 'var(--primary)',
                    fontWeight: 'bold',
                    marginBottom: '0.5rem',
                    fontSize: '1.1rem',
                  }}>
                    {event.period}
                  </div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    marginBottom: '1rem',
                    color: 'var(--light)',
                  }}>
                    {event.event}
                  </h3>
                  <div style={{ color: 'var(--text)', lineHeight: '1.6' }}>
                    {selectedEvent === index ? (
                      event.achievements.map((achievement, i) => (
                        <div key={i} style={{ marginBottom: '0.5rem' }}>
                          • {achievement}
                        </div>
                      ))
                    ) : (
                      <div>• {event.achievements[0]}</div>
                    )}
                    {selectedEvent !== index && event.achievements.length > 1 && (
                      <div style={{ color: 'var(--primary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        +{event.achievements.length - 1} more achievements (click to expand)
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TimelineSection
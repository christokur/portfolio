import React from 'react'

const ContactSection: React.FC = () => {
  const contactLinks = [
    {
      icon: '📧',
      title: 'Email',
      value: 'portfolio@christodelange.com',
      href: 'mailto:portfolio@christodelange.com',
    },
    {
      icon: '💼',
      title: 'LinkedIn',
      value: '/in/christo-de-lange-09134b5',
      href: 'https://www.linkedin.com/in/christo-de-lange-09134b5/',
    },
    {
      icon: '💻',
      title: 'GitHub',
      value: 'github.com/christokur',
      href: 'https://github.com/christokur',
    },
    {
      icon: '🚀',
      title: 'Portfolio',
      value: 'github.com/christokur/portfolio',
      href: 'https://github.com/christokur/portfolio',
    },
  ]

  return (
    <section id="contact" style={{
      padding: '5rem 2rem',
      textAlign: 'center',
      background: 'rgba(255, 255, 255, 0.02)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 className="gradient-text" style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          marginBottom: '2rem',
        }}>
          Let's Connect
        </h2>
        
        <p style={{
          color: 'var(--text)',
          fontSize: '1.5rem',
          maxWidth: '600px',
          lineHeight: '1.6',
          margin: '0 auto 4rem auto',
        }}>
          Interested in discussing platform engineering, DevOps, or opportunities?
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '3rem',
          flexWrap: 'wrap',
          marginBottom: '4rem',
        }}>
          {contactLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target={link.href.startsWith('mailto:') ? '_self' : '_blank'}
              rel="noopener noreferrer"
              className="glass"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '2rem',
                minWidth: '180px',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(14, 165, 233, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                {link.icon}
              </div>
              <div style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                marginBottom: '0.5rem',
                color: 'var(--primary)',
              }}>
                {link.title}
              </div>
              <div style={{
                color: 'var(--text)',
                fontSize: '1rem',
                textAlign: 'center',
              }}>
                {link.value}
              </div>
            </a>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text)', fontSize: '1rem' }}>
            Platform Engineering • Cloud Architecture • DevOps Excellence
          </p>
          <p style={{
            color: 'var(--text)',
            fontSize: '0.9rem',
            marginTop: '0.5rem',
          }}>
            Las Vegas Sands Corp • Senior Cloud Platform Engineer
          </p>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
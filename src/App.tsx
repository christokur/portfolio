import React, { useState, useEffect } from 'react'
import Navigation from './components/Navigation'
import HeroSection from './components/HeroSection'
import TimelineSection from './components/TimelineSection'
import MetricsSection from './components/MetricsSection'
import ArchitectureSection from './components/ArchitectureSection'
import ContactSection from './components/ContactSection'

function App() {
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'timeline', 'metrics', 'architecture', 'contact']
      const scrollPosition = window.scrollY + window.innerHeight / 3

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i])
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i])
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="App">
      <Navigation activeSection={activeSection} />
      <main>
        <HeroSection />
        <MetricsSection />
        <TimelineSection />
        <ArchitectureSection />
        <ContactSection />
      </main>
    </div>
  )
}

export default App
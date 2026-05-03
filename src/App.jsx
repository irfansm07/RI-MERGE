import { useState, useEffect, useRef } from 'react'

/* ══════════════════════ NAVBAR ══════════════════════ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <a href="#" className="logo">RI <span>MERGE</span></a>
      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <a onClick={() => scrollTo('about')}>About</a>
        <a onClick={() => scrollTo('services')}>Services</a>
        <a onClick={() => scrollTo('projects')}>Projects</a>
        <a onClick={() => scrollTo('contact')}>Contact</a>
        <a onClick={() => scrollTo('careers')} className="nav-cta">Apply as Intern</a>
      </div>
      <button className={`menu-toggle ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
        <span /><span /><span />
      </button>
    </nav>
  )
}

/* ══════════════════════ HERO ══════════════════════ */
function Hero() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  return (
    <section className="hero" id="hero">
      <div className="hero-bg-image">
        <img src="/logos/ri-3d-logo.png" alt="RI MERGE Logo" />
      </div>
      <div className="hero-bg-orb orb-1" />
      <div className="hero-bg-orb orb-2" />
      <div className="hero-bg-orb orb-3" />
      <div className="hero-content glass-panel">
        <div className="hero-badge"><span className="dot" /> Open for New Projects</div>
        <h1>We Build <span className="gradient-text">Digital Experiences</span> That Matter</h1>
        <p>RI MERGE is a forward-thinking digital studio crafting high-performance websites, apps, and software solutions that drive real business results.</p>
        <div className="hero-buttons">
          <button onClick={() => scrollTo('contact')} className="btn btn-primary"><i className="fas fa-rocket" /> Start a Project</button>
          <button onClick={() => scrollTo('projects')} className="btn btn-outline"><i className="fas fa-eye" /> View Our Work</button>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════ STATS ══════════════════════ */
function StatCounter({ target, label }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const duration = 2000
        const start = performance.now()
        const animate = (now) => {
          const progress = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setCount(Math.floor(eased * target))
          if (progress < 1) requestAnimationFrame(animate)
        }
        requestAnimationFrame(animate)
      }
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return (
    <div className="stat" ref={ref}>
      <div className="stat-number">{count}+</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

function Stats() {
  return (
    <div className="stats-bar">
      <StatCounter target={25} label="Projects Delivered" />
      <StatCounter target={15} label="Happy Clients" />
      <StatCounter target={10} label="Team Members" />
      <StatCounter target={3} label="Years Experience" />
    </div>
  )
}

/* ══════════════════════ REVEAL WRAPPER ══════════════════════ */
function Reveal({ children, delay = 0 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => setVisible(true), delay)
        observer.unobserve(entry.target)
      }
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div ref={ref} className={`reveal ${visible ? 'visible' : ''}`}>
      {children}
    </div>
  )
}

/* ══════════════════════ TYPO SHOWCASE ══════════════════════ */
const cycleWords = ['solve.', 'design.', 'prototype.', 'build.', 'develop.', 'ship.']

function TypoShowcase() {
  const containerRef = useRef(null)
  const progressRef = useRef(null)
  const counterRef = useRef(null)
  const hintRef = useRef(null)
  const trackRef = useRef(null)
  const wordsRef = useRef([])
  const dotsRef = useRef([])
  const prevIndex = useRef(-1)
  const rafId = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      if (rafId.current) cancelAnimationFrame(rafId.current)
      rafId.current = requestAnimationFrame(() => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const totalHeight = containerRef.current.offsetHeight - window.innerHeight
        const scrolled = -rect.top
        
        // Clamp between 0 and 1
        const pct = Math.max(0, Math.min(1, scrolled / totalHeight))
        
        // 1. Progress Bar
        if (progressRef.current) progressRef.current.style.width = `${pct * 100}%`
        
        // 2. Scroll Hint Fade
        if (hintRef.current) hintRef.current.style.opacity = pct < 0.05 ? '1' : '0'

        // 3. Move the continuous track slot-machine style
        // Track height is N * 100% of the viewport. We want to move from 0 to -(N-1)/N * 100%
        const numWords = cycleWords.length
        const maxScrollPct = (numWords - 1) / numWords * 100
        const trackY = -(pct * maxScrollPct)
        if (trackRef.current) {
          trackRef.current.style.transform = `translateY(${trackY}%)`
        }

        // Calculate active index for discrete UI elements (counter, dots, active glow)
        const activeIdx = Math.min(numWords - 1, Math.round(pct * (numWords - 1)))
        
        if (activeIdx !== prevIndex.current) {
          // Counter Text
          if (counterRef.current) {
            counterRef.current.textContent = `${String(activeIdx + 1).padStart(2, '0')}/${String(numWords).padStart(2, '0')}`
          }

          // Active Word Glow
          wordsRef.current.forEach((el, i) => {
            if (!el) return
            if (i === activeIdx) {
              el.classList.add('active')
            } else {
              el.classList.remove('active')
            }
          })

          // Dot Indicators
          dotsRef.current.forEach((el, i) => {
            if (!el) return
            if (i === activeIdx) {
              el.classList.add('active')
              el.classList.remove('done')
            } else if (i < activeIdx) {
              el.classList.remove('active')
              el.classList.add('done')
            } else {
              el.classList.remove('active', 'done')
            }
          })

          prevIndex.current = activeIdx
        }
      })
    }
    
    window.addEventListener('scroll', onScroll, { passive: true })
    // Initial paint
    onScroll()
    
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <div className="typo-outer" ref={containerRef}>
      <div className="typo-sticky">
        <div className="typo-grid-bg" />

        {/* Progress bar */}
        <div className="typo-progress">
          <div className="typo-progress-fill" ref={progressRef} style={{ width: '0%' }} />
        </div>

        <div className="typo-content">
          <div className="typo-static">we</div>
          <div className="typo-words-viewport">
            <div className="typo-words-track" ref={trackRef}>
              {cycleWords.map((word, i) => (
                <div
                  key={word}
                  ref={el => wordsRef.current[i] = el}
                  className={`typo-word ${i === 0 ? 'active' : ''}`}
                >
                  {word}
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="typo-subtext">
          Whatever the challenge — <span>we make it happen.</span>
        </p>

        {/* Word counter + dots */}
        <div className="typo-indicators">
          <span className="typo-counter" ref={counterRef}>
            01/{String(cycleWords.length).padStart(2, '0')}
          </span>
          <div className="typo-dots">
            {cycleWords.map((_, i) => (
              <div 
                key={i} 
                ref={el => dotsRef.current[i] = el}
                className={`typo-dot ${i === 0 ? 'active' : ''}`} 
              />
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="typo-scroll-hint" ref={hintRef}>
          <span>Scroll to explore</span>
          <div className="typo-scroll-arrow" />
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════ SERVICES ══════════════════════ */
const services = [
  { icon: '🌐', title: 'Web Development', desc: 'High-performance, responsive websites and web applications built with modern frameworks and clean architecture.' },
  { icon: '📱', title: 'Mobile Apps', desc: 'Cross-platform mobile applications designed for seamless user experience on both iOS and Android devices.' },
  { icon: '🎨', title: 'UI/UX Design', desc: 'Beautiful, intuitive interfaces crafted with user research, wireframing, prototyping, and pixel-perfect design systems.' },
  { icon: '⚙️', title: 'Backend & APIs', desc: 'Scalable server architectures, RESTful APIs, database design, and cloud deployments for robust backend systems.' },
  { icon: '🛒', title: 'E-Commerce Solutions', desc: 'Complete online store setups with payment gateways, inventory management, and custom dashboards.' },
  { icon: '🤖', title: 'AI & Automation', desc: 'Smart integrations using AI, chatbots, and workflow automation to supercharge your business operations.' },
]

function Services() {
  const scrollRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    let ticking = false

    const updateCards = () => {
      const centerX = el.scrollLeft + el.clientWidth / 2
      
      cardsRef.current.forEach((card) => {
        if (!card) return
        const cardCenter = card.offsetLeft + card.clientWidth / 2
        const dist = cardCenter - centerX
        
        const maxDist = el.clientWidth / 2
        let normalizedDist = dist / maxDist
        normalizedDist = Math.max(-1.5, Math.min(1.5, normalizedDist))
        
        // Relaxed angles slightly for better text legibility and size
        const rotateY = normalizedDist * -45 
        const translateZ = Math.abs(normalizedDist) * -350
        const translateX = normalizedDist * -80 
        const scale = 1 - Math.abs(normalizedDist) * 0.1
        const opacity = 1 - Math.abs(normalizedDist) * 0.4
        
        card.style.transform = `translateZ(${translateZ}px) translateX(${translateX}px) rotateY(${rotateY}deg) scale(${scale})`
        card.style.opacity = Math.max(0, opacity).toFixed(3)
        
        // Add focused class for vibrant CSS styling on the center card
        if (Math.abs(normalizedDist) < 0.15) {
          card.classList.add('focused')
        } else {
          card.classList.remove('focused')
        }
      })
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateCards)
        ticking = true
      }
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    updateCards()
    setTimeout(updateCards, 100) // Safety trigger after initial layout
    
    return () => {
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section className="section section-alt" id="services" style={{ overflow: 'hidden', position: 'relative' }}>
      <div className="services-corner-glows" />
      <Reveal>
        <div className="section-header">
          <span className="section-label">What We Do</span>
          <h2 className="section-title">Services We Offer</h2>
          <p className="section-desc">From idea to deployment, we handle every phase of your digital product lifecycle with precision and creativity.</p>
        </div>
      </Reveal>
      
      <div className="services-carousel-container">
        <div className="services-carousel-scroll" ref={scrollRef}>
          <div className="services-carousel-spacer" />
          
          {services.map((s, i) => (
            <div 
              key={i} 
              className="service-carousel-item"
              ref={el => cardsRef.current[i] = el}
            >
              <div className="service-card">
                <div className="service-card-bg" />
                <div className="service-number">0{i + 1}</div>
                <div className="service-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <div className="service-footer">
                  <span>Explore</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </div>
              </div>
            </div>
          ))}
          
          <div className="services-carousel-spacer" />
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════ ABOUT ══════════════════════ */
const aboutCards = [
  { icon: '🎯', title: 'Our Mission', desc: 'To empower businesses with innovative technology solutions that drive growth, efficiency, and meaningful user engagement.', accent: 'purple' },
  { icon: '👁️', title: 'Our Vision', desc: 'To become a leading digital innovation studio recognized for delivering world-class products with integrity and excellence.', accent: 'teal' },
  { icon: '💡', title: 'Our Values', desc: 'Innovation, transparency, collaboration, and relentless pursuit of quality define everything we do at RI MERGE.', accent: 'pink' },
]

function About() {
  return (
    <section className="section section-alt about-section" id="about">
      <div className="about-bg-mesh" />
      <Reveal>
        <div className="section-header">
          <span className="section-label">Who We Are</span>
          <h2 className="section-title">About <span className="gradient-text">RI MERGE</span></h2>
          <p className="section-desc">We are a team of passionate developers, designers, and strategists committed to transforming ideas into impactful digital products.</p>
        </div>
      </Reveal>
      <div className="about-grid">
        {aboutCards.map((c, i) => (
          <Reveal key={i} delay={i * 150}>
            <div className={`about-card about-card--${c.accent}`}>
              <div className="about-card__glow" />
              <div className="about-card__number">0{i + 1}</div>
              <div className="about-card__icon">{c.icon}</div>
              <h3 className="about-card__title">{c.title}</h3>
              <p className="about-card__desc">{c.desc}</p>
              <div className="about-card__line" />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ══════════════════════ PROJECTS ══════════════════════ */
const projects = [
  {
    img: '/logos/vibexpert-shop.jpg',
    tag: 'E-Commerce', title: 'VibExpert Shop',
    desc: 'A full-stack e-commerce platform with admin dashboard, inventory management, and secure payment integration.',
    tech: ['Node.js', 'MongoDB', 'HTML/CSS', 'Razorpay'],
    url: 'https://www.vibexpert.shop',
    action: 'live',
  },
  {
    img: '/logos/classynk.jpg',
    tag: 'Social Platform', title: 'Classynk',
    desc: 'A modern social media application with real-time messaging, feeds, user profiles, and community features.',
    tech: ['React', 'Supabase', 'Node.js', 'WebSockets'],
    url: null,
    action: 'coming-soon',
  },
  {
    img: '/logos/vibexpert-online.png',
    tag: 'Web Platform', title: 'VibExpert Online',
    desc: 'A dynamic online platform offering digital services, tools, and resources for businesses and creators.',
    tech: ['React', 'Node.js', 'MongoDB', 'REST API'],
    url: 'https://www.vibexpert.online',
    action: 'live',
  },
]

/* ══════════════════════ COMING SOON MODAL ══════════════════════ */
function ComingSoonModal({ show, onClose, projectTitle }) {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (show) {
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 2,
        duration: Math.random() * 4 + 3,
        delay: Math.random() * 2,
        hue: Math.random() * 60 + 240,
      }))
      setParticles(newParticles)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [show])

  if (!show) return null

  return (
    <div className={`cs-modal-backdrop ${show ? 'active' : ''}`} onClick={onClose}>
      <div className="cs-modal" onClick={(e) => e.stopPropagation()}>
        {/* Particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="cs-particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              background: `hsl(${p.hue}, 80%, 65%)`,
            }}
          />
        ))}

        {/* Glow rings */}
        <div className="cs-glow-ring ring-1" />
        <div className="cs-glow-ring ring-2" />
        <div className="cs-glow-ring ring-3" />

        {/* Content */}
        <div className="cs-content">
          <div className="cs-icon-wrap">
            <div className="cs-icon-pulse" />
            <div className="cs-icon">🚀</div>
          </div>
          <h2 className="cs-title">
            <span className="cs-title-line">Something</span>
            <span className="cs-title-line cs-gradient">Amazing</span>
            <span className="cs-title-line">is Coming</span>
          </h2>
          <p className="cs-subtitle">
            <strong>{projectTitle}</strong> is currently under development.<br />
            We're crafting something truly special — stay tuned!
          </p>
          <div className="cs-status-bar">
            <div className="cs-status-fill" />
          </div>
          <span className="cs-status-text">Building in progress...</span>
          <button className="cs-close-btn" onClick={onClose}>
            <i className="fas fa-xmark" /> Got it, I'll wait!
          </button>
        </div>
      </div>
    </div>
  )
}

function Projects() {
  const [showModal, setShowModal] = useState(false)
  const [modalProject, setModalProject] = useState('')
  const [ripples, setRipples] = useState({})
  
  // Custom Spotlight Logic
  const mouse = useRef({ x: 0, y: 0 })
  const spotlightRef = useRef(null)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    let animationFrameId
    let currentX = 0
    let currentY = 0
    
    const render = () => {
      // Lerp for smooth delay effect
      currentX += (mouse.current.x - currentX) * 0.12
      currentY += (mouse.current.y - currentY) * 0.12
      
      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate(calc(${currentX}px - 50%), calc(${currentY}px - 50%))`
      }
      animationFrameId = requestAnimationFrame(render)
    }
    render()
    
    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const handleProjectClick = (project, e) => {
    // Ripple effect
    const btn = e.currentTarget
    const rect = btn.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setRipples((prev) => ({ ...prev, [project.title]: { x, y, key: Date.now() } }))
    setTimeout(() => setRipples((prev) => { const n = { ...prev }; delete n[project.title]; return n }), 700)

    if (project.action === 'live' && project.url) {
      window.open(project.url, '_blank', 'noopener,noreferrer')
    } else if (project.action === 'coming-soon') {
      setModalProject(project.title)
      setShowModal(true)
    }
  }

  return (
    <section 
      className="section" 
      id="projects" 
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <div 
        ref={spotlightRef} 
        className={`purple-spotlight ${isHovering ? 'visible' : ''}`}
      />
      <Reveal>
        <div className="section-header">
          <div className="projects-watermark">RI MERGE</div>
          <span className="section-label">Our Portfolio</span>
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-desc">A showcase of the digital solutions we've built for clients across various industries.</p>
        </div>
      </Reveal>
      <div className="projects-grid">
        {projects.map((p, i) => (
          <Reveal key={i} delay={i * 120}>
            <div className="project-card">
              <div className="project-thumb">
                <img src={p.img} alt={p.title} />
                <div className="project-overlay"><span className="project-tag">{p.tag}</span></div>
              </div>
              <div className="project-info">
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <div className="project-tech">
                  {p.tech.map((t, j) => <span key={j}>{t}</span>)}
                </div>
                <button
                  className={`project-visit-btn ${p.action === 'coming-soon' ? 'coming-soon-btn' : ''}`}
                  onClick={(e) => handleProjectClick(p, e)}
                  style={{ position: 'relative', overflow: 'hidden' }}
                >
                  {ripples[p.title] && (
                    <span
                      key={ripples[p.title].key}
                      className="btn-ripple"
                      style={{ left: ripples[p.title].x, top: ripples[p.title].y }}
                    />
                  )}
                  {p.action === 'live' ? (
                    <><i className="fas fa-arrow-up-right-from-square" /> Visit Website</>
                  ) : (
                    <><i className="fas fa-clock" /> Coming Soon</>
                  )}
                </button>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <ComingSoonModal
        show={showModal}
        onClose={() => setShowModal(false)}
        projectTitle={modalProject}
      />
    </section>
  )
}

/* ══════════════════════ TOAST ══════════════════════ */
function Toast({ message, show, isError }) {
  return (
    <div className={`toast ${show ? 'show' : ''}`} style={{ background: isError ? '#d63031' : '#00b894' }}>
      {message}
    </div>
  )
}

/* ══════════════════════ CONTACT + INTERN FORMS ══════════════════════ */
function ContactSection() {
  const [toast, setToast] = useState({ show: false, message: '', isError: false })
  const [isProjectFlipped, setIsProjectFlipped] = useState(false)
  const [isInternFlipped, setIsInternFlipped] = useState(false)

  const showToast = (message, isError = false) => {
    setToast({ show: true, message, isError })
    setTimeout(() => setToast(t => ({ ...t, show: false })), 4000)
  }

  const handleContact = (e) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    const name = fd.get('name'), email = fd.get('email'), message = fd.get('message')
    if (!name || !email || !message) return showToast('Please fill in all required fields.', true)
    const subject = encodeURIComponent(`Project Inquiry from ${name}`)
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nCompany: ${fd.get('company')}\nBudget: ${fd.get('budget')}\nType: ${fd.get('type')}\n\nMessage:\n${message}`
    )
    window.location.href = `mailto:contact@rimerge.com?subject=${subject}&body=${body}`
    showToast('✅ Opening your email client...')
    e.target.reset()
  }

  const handleIntern = (e) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    const name = fd.get('name'), email = fd.get('email'), phone = fd.get('phone'), message = fd.get('message')
    if (!name || !email || !phone || !message) return showToast('Please fill in all required fields.', true)
    const subject = encodeURIComponent(`Internship Application - ${name}`)
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nCollege: ${fd.get('college')}\nRole: ${fd.get('role')}\nSkills: ${fd.get('skills')}\nPortfolio: ${fd.get('portfolio')}\n\nWhy RI MERGE:\n${message}`
    )
    window.location.href = `mailto:careers@rimerge.com?subject=${subject}&body=${body}`
    showToast('✅ Opening your email client...')
    e.target.reset()
  }

  return (
    <section className="section section-alt" id="contact">
      <Reveal>
        <div className="section-header">
          <span className="section-label">Get In Touch</span>
          <h2 className="section-title">Let's Work Together</h2>
          <p className="section-desc">Have a project in mind? Or want to join our team as an intern? Fill out the relevant form below.</p>
        </div>
      </Reveal>
      <div className="forms-wrapper">

        {/* Project Form */}
        <Reveal delay={0}>
          <div className={`flip-card ${isProjectFlipped ? 'flipped' : ''}`}>
            <div className="flip-card-inner">
              {/* FRONT SIDE */}
              <div className="flip-card-front" onClick={() => setIsProjectFlipped(true)}>
                <div className="card-watermark">HIRE US</div>
                <div className="ri-logo-group">
                  <span className="ri-box-text">RI MERGE</span>
                  <div className="ri-neon-logo">
                    <span className="ri-neon-text">RI</span>
                  </div>
                  <span className="ri-box-text">RI MERGE</span>
                </div>
                <h3>Hire Us for a Project</h3>
                <p>Got an idea? Let's build something amazing together.</p>
                <button className="btn-flip">Click to Fill Form</button>
              </div>

              {/* BACK SIDE */}
              <div className="flip-card-back form-card">
                <div className="flip-card-header">
                  <h3>📩 Hire Us</h3>
                  <button type="button" className="btn-back" onClick={() => setIsProjectFlipped(false)}>
                    <i className="fas fa-arrow-left"></i> Back
                  </button>
                </div>
                <p className="form-subtitle">Tell us about your project.</p>
                <form onSubmit={handleContact}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input type="text" name="name" placeholder="John Doe" required />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input type="email" name="email" placeholder="john@example.com" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Company / Organization</label>
                    <input type="text" name="company" placeholder="Your company name" />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Budget Range</label>
                      <select name="budget">
                        <option value="">Select budget</option>
                        <option>₹10,000 – ₹25,000</option>
                        <option>₹25,000 – ₹50,000</option>
                        <option>₹50,000 – ₹1,00,000</option>
                        <option>₹1,00,000+</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Project Type</label>
                      <select name="type">
                        <option value="">Select type</option>
                        <option>Website</option>
                        <option>Mobile App</option>
                        <option>E-Commerce</option>
                        <option>UI/UX Design</option>
                        <option>Custom Software</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Project Details</label>
                    <textarea name="message" placeholder="Describe your project requirements, timeline, and goals..." required />
                  </div>
                  <button type="submit" className="btn-submit"><i className="fas fa-paper-plane" /> Send Project Inquiry</button>
                </form>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Internship Form */}
        <Reveal delay={150}>
          <div className={`flip-card ${isInternFlipped ? 'flipped' : ''}`} id="careers">
            <div className="flip-card-inner">
              {/* FRONT SIDE */}
              <div className="flip-card-front" onClick={() => setIsInternFlipped(true)}>
                <div className="card-watermark">APPLY</div>
                <div className="ri-logo-group">
                  <span className="ri-box-text">RI MERGE</span>
                  <div className="ri-neon-logo">
                    <span className="ri-neon-text">RI</span>
                  </div>
                  <span className="ri-box-text">RI MERGE</span>
                </div>
                <h3>Apply as an Intern</h3>
                <p>We're looking for passionate learners to join our growing team.</p>
                <button className="btn-flip">Click to Apply</button>
              </div>

              {/* BACK SIDE */}
              <div className="flip-card-back form-card">
                <div className="flip-card-header">
                  <h3>🎓 Apply as Intern</h3>
                  <button type="button" className="btn-back" onClick={() => setIsInternFlipped(false)}>
                    <i className="fas fa-arrow-left"></i> Back
                  </button>
                </div>
                <p className="form-subtitle">Fill in your details below.</p>
                <form onSubmit={handleIntern}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input type="text" name="name" placeholder="Your full name" required />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input type="email" name="email" placeholder="you@email.com" required />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input type="tel" name="phone" placeholder="+91 XXXXX XXXXX" required />
                    </div>
                    <div className="form-group">
                      <label>College / University</label>
                      <input type="text" name="college" placeholder="Your institution" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Preferred Role</label>
                    <select name="role" required>
                      <option value="">Select role</option>
                      <option>Frontend Developer</option>
                      <option>Backend Developer</option>
                      <option>Full Stack Developer</option>
                      <option>UI/UX Designer</option>
                      <option>Mobile App Developer</option>
                      <option>Marketing / Content</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Skills & Technologies</label>
                    <input type="text" name="skills" placeholder="e.g. React, Node.js, Figma, Python" required />
                  </div>
                  <div className="form-group">
                    <label>Portfolio / GitHub Link</label>
                    <input type="url" name="portfolio" placeholder="https://github.com/yourprofile" />
                  </div>
                  <div className="form-group">
                    <label>Why do you want to intern at RI MERGE?</label>
                    <textarea name="message" placeholder="Tell us about your passion, goals, and what you hope to learn..." required />
                  </div>
                  <button type="submit" className="btn-submit"><i className="fas fa-user-plus" /> Submit Application</button>
                </form>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <Toast message={toast.message} show={toast.show} isError={toast.isError} />
    </section>
  )
}

/* ══════════════════════ FOOTER ══════════════════════ */
function Footer() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <a href="#" className="logo">RI <span>MERGE</span></a>
          <p>Building the future, one pixel and one line of code at a time. Let's create something extraordinary together.</p>
          <div className="footer-socials">
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram" /></a>
            <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in" /></a>
            <a href="#" aria-label="GitHub"><i className="fab fa-github" /></a>
            <a href="#" aria-label="Twitter"><i className="fab fa-x-twitter" /></a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Navigation</h4>
          <a onClick={() => scrollTo('about')}>About Us</a>
          <a onClick={() => scrollTo('services')}>Services</a>
          <a onClick={() => scrollTo('projects')}>Projects</a>
          <a onClick={() => scrollTo('contact')}>Contact</a>
        </div>
        <div className="footer-col">
          <h4>Services</h4>
          <a href="#">Web Development</a>
          <a href="#">Mobile Apps</a>
          <a href="#">UI/UX Design</a>
          <a href="#">E-Commerce</a>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <a onClick={() => scrollTo('careers')}>Internships</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="mailto:contact@rimerge.com">Email Us</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 RI MERGE. All rights reserved. Built with ❤️ by the RI MERGE team.</p>
      </div>
    </footer>
  )
}

/* ══════════════════════ APP ══════════════════════ */
export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <TypoShowcase />
      <Services />
      <About />
      <Projects />
      <ContactSection />
      <Footer />
    </>
  )
}

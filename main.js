// Mobile Navigation Toggle
const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileToggle && mobileMenu) {
  mobileToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
    });
  });
}

// Copy Default Prefix Button
const copyPrefixBtn = document.getElementById('copyPrefixBtn');
if (copyPrefixBtn) {
  copyPrefixBtn.addEventListener('click', () => {
    navigator.clipboard.writeText('!help').then(() => {
      copyPrefixBtn.classList.add('copied');
      setTimeout(() => {
        copyPrefixBtn.classList.remove('copied');
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy prefix: ', err);
    });
  });
}

// Command Tab Switcher
const tabButtons = document.querySelectorAll('.tab-btn');
const commandGroups = document.querySelectorAll('.command-group');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const tabTarget = btn.getAttribute('data-tab');

    tabButtons.forEach(b => b.classList.remove('active'));
    commandGroups.forEach(cg => cg.classList.remove('active'));

    btn.classList.add('active');
    const activeGroup = document.getElementById(`tab-${tabTarget}`);
    if (activeGroup) {
      activeGroup.classList.add('active');
    }
  });
});

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const questionBtn = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');

  questionBtn.addEventListener('click', () => {
    const isOpen = item.classList.contains('active');

    // Close all other items
    faqItems.forEach(otherItem => {
      otherItem.classList.remove('active');
      const otherAnswer = otherItem.querySelector('.faq-answer');
      if (otherAnswer) {
        otherAnswer.style.maxHeight = null;
      }
    });

    if (!isOpen) {
      item.classList.add('active');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// 3D Smooth Mouse Tilt Effect for the Bot Icon
const tiltWrapper = document.querySelector('.avatar-tilt-wrapper');
const tiltCard = document.querySelector('.avatar-shield-card');

if (tiltWrapper && tiltCard) {
  let isHovering = false;
  let targetRotateX = 0;
  let targetRotateY = 0;
  let currentRotateX = 0;
  let currentRotateY = 0;
  let animationFrameId = null;

  function renderTilt() {
    // Linear interpolation for smooth fluid damping
    currentRotateX += (targetRotateX - currentRotateX) * 0.12;
    currentRotateY += (targetRotateY - currentRotateY) * 0.12;

    tiltCard.style.transform = `perspective(600px) rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg) scale3d(${isHovering ? '1.08, 1.08, 1.08' : '1, 1, 1'})`;

    if (isHovering || Math.abs(currentRotateX) > 0.05 || Math.abs(currentRotateY) > 0.05) {
      animationFrameId = requestAnimationFrame(renderTilt);
    } else {
      tiltCard.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      animationFrameId = null;
    }
  }

  tiltWrapper.addEventListener('mouseenter', () => {
    isHovering = true;
    if (!animationFrameId) {
      animationFrameId = requestAnimationFrame(renderTilt);
    }
  });

  tiltWrapper.addEventListener('mousemove', (e) => {
    const rect = tiltWrapper.getBoundingClientRect();
    const x = e.clientX - rect.left; // mouse x within element
    const y = e.clientY - rect.top;  // mouse y within element

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Max tilt angle: 25 degrees
    const maxTilt = 24;
    targetRotateX = ((y - centerY) / centerY) * -maxTilt;
    targetRotateY = ((x - centerX) / centerX) * maxTilt;
  });

  tiltWrapper.addEventListener('mouseleave', () => {
    isHovering = false;
    targetRotateX = 0;
    targetRotateY = 0;
  });
}

// Scroll Reveal Animation (Intersection Observer)
const revealElements = document.querySelectorAll('[data-reveal]');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target); // Reveal once
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -60px 0px', // Triggers slightly before element enters view
    threshold: 0.12
  });

  revealElements.forEach(el => revealObserver.observe(el));
} else {
  // Fallback for browsers without IntersectionObserver
  revealElements.forEach(el => el.classList.add('is-revealed'));
}

// Custom Glowing Cyber Cursor with Spring Damping
const cursorDot = document.getElementById('cursorDot');
const cursorGlow = document.getElementById('cursorGlow');

if (cursorDot && cursorGlow) {
  let mouseX = -100;
  let mouseY = -100;
  let glowX = -100;
  let glowY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  });

  function renderCursorGlow() {
    glowX += (mouseX - glowX) * 0.16;
    glowY += (mouseY - glowY) * 0.16;
    cursorGlow.style.transform = `translate3d(${glowX.toFixed(2)}px, ${glowY.toFixed(2)}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(renderCursorGlow);
  }
  requestAnimationFrame(renderCursorGlow);

  // Expand cursor on clickable elements
  const interactives = document.querySelectorAll('a, button, .feature-card, .stat-card, .faq-question, .hero-bot-avatar, .dev-card');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// Interactive Particle Background (Reacts to cursor)
const particleCanvas = document.getElementById('particleCanvas');
if (particleCanvas) {
  const ctx = particleCanvas.getContext('2d');
  let width = (particleCanvas.width = window.innerWidth);
  let height = (particleCanvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = particleCanvas.width = window.innerWidth;
    height = particleCanvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(Math.floor(width / 22), 55);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.alpha = Math.random() * 0.45 + 0.15;
    }
    update(cursorPos) {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Gentle repel / connection near cursor
      if (cursorPos.x !== null) {
        const dx = cursorPos.x - this.x;
        const dy = cursorPos.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          const force = (110 - dist) / 110;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(239, 68, 68, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  const cursorCoord = { x: null, y: null };
  window.addEventListener('mousemove', (e) => {
    cursorCoord.x = e.clientX;
    cursorCoord.y = e.clientY;
  });

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(239, 68, 68, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update(cursorCoord);
      p.draw();
    });

    requestAnimationFrame(animateParticles);
  }
  requestAnimationFrame(animateParticles);
}

// Feature Cards Interactive Mouse Spotlight Tracker
document.querySelectorAll('.feature-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});

// Magnetic Buttons & Click Ripple Effect
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate3d(${x * 0.18}px, ${y * 0.22}px, 0)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate3d(0, 0, 0)';
  });

  btn.addEventListener('click', (e) => {
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.classList.add('ripple-wave');
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Scroll Progress Bar & Back to Top Toggle
const scrollProgressBar = document.getElementById('scrollProgressBar');
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  if (scrollProgressBar) {
    scrollProgressBar.style.width = `${scrollPercent}%`;
  }

  if (backToTopBtn) {
    if (scrollTop > 450) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }
});

if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Live Command Search Filter
const cmdSearchInput = document.getElementById('cmdSearchInput');
const cmdClearBtn = document.getElementById('cmdClearBtn');
const allCmdItems = document.querySelectorAll('.cmd-item');

if (cmdSearchInput) {
  cmdSearchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    if (query.length > 0) {
      if (cmdClearBtn) cmdClearBtn.style.display = 'block';

      // Show all tabs when searching
      document.querySelectorAll('.command-group').forEach(cg => cg.classList.add('active'));

      allCmdItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(query)) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    } else {
      if (cmdClearBtn) cmdClearBtn.style.display = 'none';

      // Restore active tab view
      const activeTabBtn = document.querySelector('.tab-btn.active');
      const activeTabTarget = activeTabBtn ? activeTabBtn.getAttribute('data-tab') : 'antinuke';

      document.querySelectorAll('.command-group').forEach(cg => {
        if (cg.id === `tab-${activeTabTarget}`) {
          cg.classList.add('active');
        } else {
          cg.classList.remove('active');
        }
      });

      allCmdItems.forEach(item => {
        item.style.display = 'flex';
      });
    }
  });

  if (cmdClearBtn) {
    cmdClearBtn.addEventListener('click', () => {
      cmdSearchInput.value = '';
      cmdSearchInput.dispatchEvent(new Event('input'));
      cmdSearchInput.focus();
    });
  }
}

// Click to Copy on Individual Command Items
allCmdItems.forEach(item => {
  const codeEl = item.querySelector('code');
  if (codeEl) {
    codeEl.style.cursor = 'pointer';
    codeEl.title = 'Click to copy command';
    codeEl.addEventListener('click', (e) => {
      e.stopPropagation();
      const rawText = codeEl.textContent.trim();
      navigator.clipboard.writeText(rawText).then(() => {
        const originalText = codeEl.textContent;
        codeEl.textContent = 'Copied!';
        codeEl.style.color = '#22c55e';
        codeEl.style.borderColor = '#22c55e';
        setTimeout(() => {
          codeEl.textContent = originalText;
          codeEl.style.color = '';
          codeEl.style.borderColor = '';
        }, 1500);
      });
    });
  }
});

// Interactive Defense Simulation Sandbox
const simTerminalScreen = document.getElementById('simTerminalScreen');
const simButtons = document.querySelectorAll('.sim-btn');
const simResetBtn = document.getElementById('simResetBtn');

const simulationScenarios = {
  nuke: [
    { type: 'threat', text: '[ATTACK IN PROGRESS] Compromised admin account "RogueAdmin#1337" triggered mass channel deletion.' },
    { type: 'action', text: '[RADAR LOCK] Anti-nuke trigger fired: 4 channel delete events in 9ms.' },
    { type: 'action', text: '[SANCTION] Administrator permissions stripped & RogueAdmin#1337 banned permanently.' },
    { type: 'info', text: '[AUTO-RECOVERY] Re-creating 4 channels with original permissions & topic settings (14ms).' },
    { type: 'system', text: '[SECURE] Server fully protected. 0 channels lost. Audit report dispatched.' }
  ],
  raid: [
    { type: 'threat', text: '[ATTACK IN PROGRESS] Anomaly detected: 85 bot accounts joined within 3 seconds.' },
    { type: 'action', text: '[RAIDMODE AUTO-ENGAGED] Verification level raised to HIGHEST & Invite lock active.' },
    { type: 'action', text: '[BULK PURGE] All 85 raiding bots quarantined & kicked/banned from server.' },
    { type: 'info', text: '[DEFENSE SCAN] Minimum account age filter enforced (30-day requirement).' },
    { type: 'system', text: '[SECURE] Raid neutralized in 120ms. General channels safe & chat restored.' }
  ],
  spam: [
    { type: 'threat', text: '[SUSPICIOUS ACTIVITY] User "free_nitro_claim" spammed 6 phishing URLs across channels.' },
    { type: 'action', text: '[AUTOMOD DEFENSE] Filter matched known token grabber domain pattern.' },
    { type: 'action', text: '[INSTANT PURGE] 6 scam messages wiped across all channels in 11ms.' },
    { type: 'info', text: '[SANCTION APPLIED] Offender timed out for 24 hours & auto-warn logged.' },
    { type: 'system', text: '[SECURE] Zero members compromised.' }
  ],
  admin: [
    { type: 'threat', text: '[THREAT DETECTED] Unauthorized bot invite attempt by non-owner user ID.' },
    { type: 'action', text: '[DEFENSE PROTOCOL] Non-whitelisted bot join blocked instantly.' },
    { type: 'action', text: '[SANCTION] Inviter quarantined for security review.' },
    { type: 'info', text: '[AUDIT LOG] Incident logged to #security-logs with user discriminator.' },
    { type: 'system', text: '[SECURE] Server hierarchy protected intact.' }
  ]
};

if (simButtons.length > 0 && simTerminalScreen) {
  simButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const threatType = btn.getAttribute('data-threat');
      const scenario = simulationScenarios[threatType];
      if (!scenario) return;

      simTerminalScreen.innerHTML = '';
      simButtons.forEach(b => b.style.pointerEvents = 'none');

      scenario.forEach((step, index) => {
        setTimeout(() => {
          const line = document.createElement('div');
          line.className = `term-line ${step.type}`;
          line.textContent = step.text;
          simTerminalScreen.appendChild(line);
          simTerminalScreen.scrollTop = simTerminalScreen.scrollHeight;

          if (index === scenario.length - 1) {
            simButtons.forEach(b => b.style.pointerEvents = 'all');
          }
        }, index * 420);
      });
    });
  });

  if (simResetBtn) {
    simResetBtn.addEventListener('click', () => {
      simTerminalScreen.innerHTML = `
        <div class="term-line system"><span class="prompt">[SYSTEM READY]</span> Xyris Guard Security Core v2.0 online. Select a threat scenario above to simulate response.</div>
      `;
    });
  }
}




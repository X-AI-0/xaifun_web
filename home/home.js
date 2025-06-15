// Home Page Interactive Effects
document.addEventListener('DOMContentLoaded', function() {
    
    // Matrix Rain Effect
    createMatrixRain();
    
    // Particle System
    initParticleSystem();
    
    // Interactive Navigation
    initNavigation();
    
    // Hologram Animation
    initHologramEffects();
    
    // Typing Effect for Hero Title
    initTypingEffect();
    
    // Smooth Scrolling
    initSmoothScrolling();
});

// Matrix Rain Effect
function createMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.1';
    canvas.style.pointerEvents = 'none';
    
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const charArray = chars.split('');
    
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];
    
    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }
    
    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ffff';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(drawMatrix, 50);
}

// Particle System
function initParticleSystem() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    particleContainer.style.position = 'fixed';
    particleContainer.style.top = '0';
    particleContainer.style.left = '0';
    particleContainer.style.width = '100%';
    particleContainer.style.height = '100%';
    particleContainer.style.zIndex = '-1';
    particleContainer.style.pointerEvents = 'none';
    
    document.body.appendChild(particleContainer);
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '2px';
        particle.style.height = '2px';
        particle.style.background = '#00ffff';
        particle.style.borderRadius = '50%';
        particle.style.boxShadow = '0 0 6px #00ffff';
        
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        const endX = Math.random() * window.innerWidth;
        const endY = Math.random() * window.innerHeight;
        
        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';
        
        particleContainer.appendChild(particle);
        
        const duration = 3000 + Math.random() * 2000;
        
        particle.animate([
            { transform: `translate(0, 0)`, opacity: 0 },
            { transform: `translate(${endX - startX}px, ${endY - startY}px)`, opacity: 1 },
            { transform: `translate(${endX - startX}px, ${endY - startY}px)`, opacity: 0 }
        ], {
            duration: duration,
            easing: 'ease-in-out'
        }).onfinish = () => {
            particle.remove();
        };
    }
    
    // Create particles periodically
    setInterval(createParticle, 500);
}

// Interactive Navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.textShadow = '0 0 10px #00ffff';
        });
        
        link.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.textShadow = 'none';
            }
        });
    });
}

// Hologram Effects
function initHologramEffects() {
    const hologramContainer = document.querySelector('.hologram-container');
    
    if (hologramContainer) {
        // Add glitch effect on hover
        hologramContainer.addEventListener('mouseenter', function() {
            this.style.filter = 'hue-rotate(90deg) brightness(1.2)';
            this.style.animation = 'hologramGlitch 0.5s ease-in-out';
        });
        
        hologramContainer.addEventListener('mouseleave', function() {
            this.style.filter = 'none';
            this.style.animation = 'none';
        });
        
        // Add random glitch effects
        setInterval(() => {
            if (Math.random() < 0.1) {
                hologramContainer.style.filter = 'hue-rotate(180deg) contrast(1.5)';
                setTimeout(() => {
                    hologramContainer.style.filter = 'none';
                }, 100);
            }
        }, 2000);
    }
}

// Typing Effect
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    const originalText = heroTitle.textContent;
    heroTitle.textContent = '';
    
    let i = 0;
    const typeSpeed = 100;
    
    function typeWriter() {
        if (i < originalText.length) {
            heroTitle.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, typeSpeed);
        } else {
            // Add blinking cursor effect
            const cursor = document.createElement('span');
            cursor.textContent = '|';
            cursor.style.animation = 'blink 1s infinite';
            heroTitle.appendChild(cursor);
            
            // Remove cursor after 3 seconds
            setTimeout(() => {
                cursor.remove();
            }, 3000);
        }
    }
    
    // Start typing effect after a short delay
    setTimeout(typeWriter, 1000);
}

// Smooth Scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Feature Card Interactions
document.addEventListener('DOMContentLoaded', function() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add pulsing effect to icon
            const icon = this.querySelector('.feature-icon');
            if (icon) {
                icon.style.animation = 'pulse 0.5s ease-in-out';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.feature-icon');
            if (icon) {
                icon.style.animation = 'none';
            }
        });
    });
});

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }
    
    @keyframes hologramGlitch {
        0% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
        100% { transform: translate(0); }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Mouse trail effect
document.addEventListener('mousemove', function(e) {
    if (Math.random() < 0.1) {
        const trail = document.createElement('div');
        trail.style.position = 'fixed';
        trail.style.left = e.clientX + 'px';
        trail.style.top = e.clientY + 'px';
        trail.style.width = '4px';
        trail.style.height = '4px';
        trail.style.background = '#00ffff';
        trail.style.borderRadius = '50%';
        trail.style.pointerEvents = 'none';
        trail.style.zIndex = '1000';
        trail.style.opacity = '0.7';
        
        document.body.appendChild(trail);
        
        trail.animate([
            { transform: 'scale(1)', opacity: 0.7 },
            { transform: 'scale(0)', opacity: 0 }
        ], {
            duration: 1000,
            easing: 'ease-out'
        }).onfinish = () => {
            trail.remove();
        };
    }
}); 
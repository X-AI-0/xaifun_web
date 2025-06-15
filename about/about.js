// About Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initAboutPage();
    initInteractiveElements();
    initScrollAnimations();
});

function initAboutPage() {
    createMatrixRain();
    initParticleSystem();
    initNavigation();
}

function initInteractiveElements() {
    // Neural sphere interaction
    initNeuralSphere();
    
    // Data visualization interaction
    initDataVisualization();
    
    // Team member interactions
    initTeamInteractions();
    
    // Technology stack interactions
    initTechStackInteractions();
}

function initNeuralSphere() {
    const neuralSphere = document.querySelector('.neural-sphere');
    
    if (neuralSphere) {
        neuralSphere.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.filter = 'brightness(1.3) hue-rotate(30deg)';
        });
        
        neuralSphere.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.filter = 'none';
        });
        
        // Add random glitch effects
        setInterval(() => {
            if (Math.random() < 0.1) {
                neuralSphere.style.filter = 'hue-rotate(180deg) contrast(1.5)';
                setTimeout(() => {
                    neuralSphere.style.filter = 'none';
                }, 150);
            }
        }, 3000);
    }
}

function initDataVisualization() {
    const dataNodes = document.querySelectorAll('.data-node');
    const dataConnections = document.querySelectorAll('.data-connection');
    
    // Add click interactions to data nodes
    dataNodes.forEach((node, index) => {
        node.addEventListener('click', function() {
            // Pulse effect
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'nodeGlow 2s ease-in-out infinite alternate';
            }, 10);
            
            // Highlight connected lines
            dataConnections.forEach(connection => {
                connection.style.background = 'linear-gradient(90deg, #ff0080, #00ffff)';
                setTimeout(() => {
                    connection.style.background = 'linear-gradient(90deg, #00ffff, rgba(0, 255, 255, 0.3))';
                }, 1000);
            });
        });
        
        node.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.5)';
            this.style.boxShadow = '0 0 40px rgba(0, 255, 255, 1)';
        });
        
        node.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.8)';
        });
    });
}

function initTeamInteractions() {
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        const avatar = member.querySelector('.member-avatar');
        const avatarIcon = member.querySelector('.avatar-icon');
        
        member.addEventListener('mouseenter', function() {
            // Rotate avatar
            if (avatar) {
                avatar.style.transform = 'rotate(360deg)';
                avatar.style.transition = 'transform 0.8s ease';
            }
            
            // Scale icon
            if (avatarIcon) {
                avatarIcon.style.transform = 'scale(1.2)';
                avatarIcon.style.transition = 'transform 0.3s ease';
            }
            
            // Add typing effect to bio
            const bio = this.querySelector('.member-bio');
            if (bio && !bio.dataset.animated) {
                bio.dataset.animated = 'true';
                typeWriterEffect(bio);
            }
        });
        
        member.addEventListener('mouseleave', function() {
            if (avatar) {
                avatar.style.transform = 'rotate(0deg)';
            }
            
            if (avatarIcon) {
                avatarIcon.style.transform = 'scale(1)';
            }
        });
    });
}

function initTechStackInteractions() {
    const techItems = document.querySelectorAll('.tech-item');
    
    techItems.forEach(item => {
        item.addEventListener('click', function() {
            // Create floating effect
            const rect = this.getBoundingClientRect();
            const clone = this.cloneNode(true);
            
            clone.style.position = 'fixed';
            clone.style.left = rect.left + 'px';
            clone.style.top = rect.top + 'px';
            clone.style.zIndex = '1000';
            clone.style.pointerEvents = 'none';
            
            document.body.appendChild(clone);
            
            clone.animate([
                { transform: 'translateY(0) scale(1)', opacity: 1 },
                { transform: 'translateY(-100px) scale(1.5)', opacity: 0 }
            ], {
                duration: 1500,
                easing: 'ease-out'
            }).onfinish = () => {
                clone.remove();
            };
            
            // Original item pulse
            this.style.animation = 'pulse 0.3s ease-in-out';
            setTimeout(() => {
                this.style.animation = 'none';
            }, 300);
        });
    });
}

function initScrollAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Special animations for specific elements
                if (entry.target.classList.contains('mission-card')) {
                    animateMissionCard(entry.target);
                } else if (entry.target.classList.contains('team-member')) {
                    animateTeamMember(entry.target);
                } else if (entry.target.classList.contains('tech-category')) {
                    animateTechCategory(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animatedElements = document.querySelectorAll('.mission-card, .team-member, .tech-category, .vision-point');
    animatedElements.forEach(el => observer.observe(el));
}

function animateMissionCard(card) {
    const icon = card.querySelector('.mission-icon');
    if (icon) {
        setTimeout(() => {
            icon.style.animation = 'bounce 0.6s ease-in-out';
        }, 200);
    }
}

function animateTeamMember(member) {
    const avatar = member.querySelector('.member-avatar');
    if (avatar) {
        setTimeout(() => {
            avatar.style.animation = 'avatarEntrance 0.8s ease-out';
        }, 300);
    }
}

function animateTechCategory(category) {
    const items = category.querySelectorAll('.tech-item');
    items.forEach((item, index) => {
        setTimeout(() => {
            item.style.animation = 'techItemSlide 0.5s ease-out forwards';
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 50);
        }, index * 100);
    });
}

function typeWriterEffect(element) {
    const text = element.textContent;
    element.textContent = '';
    element.style.opacity = '1';
    
    let i = 0;
    const speed = 30;
    
    function typeChar() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typeChar, speed);
        }
    }
    
    typeChar();
}

// Reuse effects from other pages
function createMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.03';
    canvas.style.pointerEvents = 'none';
    
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const chars = '01';
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
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(drawMatrix, 150);
}

function initParticleSystem() {
    setInterval(() => {
        if (Math.random() < 0.1) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.width = '3px';
            particle.style.height = '3px';
            particle.style.background = '#00ffff';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '-1';
            particle.style.left = Math.random() * window.innerWidth + 'px';
            particle.style.top = Math.random() * window.innerHeight + 'px';
            particle.style.opacity = '0.6';
            particle.style.boxShadow = '0 0 6px #00ffff';
            
            document.body.appendChild(particle);
            
            particle.animate([
                { transform: 'scale(1) rotate(0deg)', opacity: 0.6 },
                { transform: 'scale(0) rotate(360deg)', opacity: 0 }
            ], {
                duration: 4000,
                easing: 'ease-out'
            }).onfinish = () => {
                particle.remove();
            };
        }
    }, 2000);
}

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

// Add additional CSS animations
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-20px); }
        60% { transform: translateY(-10px); }
    }
    
    @keyframes avatarEntrance {
        0% { 
            transform: scale(0) rotate(0deg);
            opacity: 0;
        }
        50% {
            transform: scale(1.2) rotate(180deg);
            opacity: 0.8;
        }
        100% { 
            transform: scale(1) rotate(360deg);
            opacity: 1;
        }
    }
    
    @keyframes techItemSlide {
        from {
            transform: translateX(-20px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .animate-in {
        animation: fadeInUp 0.8s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .mission-card,
    .team-member,
    .tech-category,
    .vision-point {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s ease-out;
    }
    
    .mission-card.animate-in,
    .team-member.animate-in,
    .tech-category.animate-in,
    .vision-point.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(additionalStyles);

console.log('About page loaded'); 
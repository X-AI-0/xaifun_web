// Conversations Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the conversations page
    initConversationsPage();
    
    // Load conversations from JSON files
    loadConversations();
    
    // Initialize search and filter functionality
    initSearchAndFilter();
    
    // Initialize modal functionality
    initModal();
});

let allConversations = [];
let filteredConversations = [];

// Initialize the conversations page
function initConversationsPage() {
    // Add matrix rain effect
    createMatrixRain();
    
    // Add particle system
    initParticleSystem();
    
    // Initialize navigation effects
    initNavigation();
}

// Load conversations from JSON files dynamically
async function loadConversations() {
    try {
        // First, try to load the conversation index file
        const conversations = await loadConversationsFromIndex();
        
        // Simulate loading delay for better UX
        setTimeout(() => {
            allConversations = conversations;
            filteredConversations = [...allConversations];
            displayConversations(filteredConversations);
            hideLoading();
        }, 1500);
        
    } catch (error) {
        console.error('Error loading conversations:', error);
        // Fallback to scanning for known files
        await loadConversationsFromKnownFiles();
    }
}

// Load conversations using an index file (recommended approach)
async function loadConversationsFromIndex() {
    try {
        const response = await fetch('../ai-conversations/index.json');
        if (!response.ok) {
            throw new Error('Index file not found');
        }
        
        const index = await response.json();
        const conversations = [];
        
        // Load each conversation file listed in the index
        for (const filename of index.files) {
            try {
                const conversationResponse = await fetch(`../ai-conversations/${filename}`);
                if (conversationResponse.ok) {
                    const conversationData = await conversationResponse.json();
                    const transformedConversation = transformConversationData(conversationData);
                    conversations.push(transformedConversation);
                }
            } catch (error) {
                console.warn(`Failed to load conversation file: ${filename}`, error);
            }
        }
        
        return conversations;
    } catch (error) {
        throw new Error('Failed to load from index file');
    }
}

// Fallback: Load conversations from known files
async function loadConversationsFromKnownFiles() {
    try {
        // List of known conversation files (you can update this list)
        const knownFiles = [
            '79d83ff2-a3da-4474-8c72-26045102e024.json',
            '3bfb4055-4a3c-4dc4-a0d1-c005806c4307.json'
        ];
        
        const conversations = [];
        
        // Load each known conversation file
        for (const filename of knownFiles) {
            try {
                const response = await fetch(`../ai-conversations/${filename}`);
                if (response.ok) {
                    const conversationData = await response.json();
                    const transformedConversation = transformConversationData(conversationData);
                    conversations.push(transformedConversation);
                }
            } catch (error) {
                console.warn(`Failed to load conversation file: ${filename}`, error);
            }
        }
        
        // Update the display
        setTimeout(() => {
            allConversations = conversations;
            filteredConversations = [...allConversations];
            displayConversations(filteredConversations);
            hideLoading();
        }, 1500);
        
    } catch (error) {
        console.error('Error loading conversations from known files:', error);
        showError('Failed to load conversations. Please try again later.');
    }
}

// Transform conversation data from new format to display format
function transformConversationData(data) {
    // Determine category based on topic
    const category = categorizeByTopic(data.topic);
    
    // Count AI messages (excluding system messages)
    const messageCount = data.messages.filter(msg => msg.role === 'assistant').length;
    
    // Create preview from first AI message
    const firstAiMessage = data.messages.find(msg => msg.role === 'assistant');
    const preview = firstAiMessage ? 
        firstAiMessage.content.substring(0, 150) + '...' : 
        'AI discussion about ' + data.topic;
    
    // Format date
    const date = new Date(data.createdAt).toISOString().split('T')[0];
    
    return {
        id: data.id,
        title: capitalizeTitle(data.topic),
        category: category,
        preview: preview,
        date: date,
        messages: messageCount,
        participants: data.models || ['AI Systems'],
        originalData: data // Keep original data for modal display
    };
}

// Categorize conversation based on topic
function categorizeByTopic(topic) {
    const topicLower = topic.toLowerCase();
    
    if (topicLower.includes('love') || topicLower.includes('life') || topicLower.includes('death') || 
        topicLower.includes('consciousness') || topicLower.includes('meaning') || topicLower.includes('ethics')) {
        return 'philosophical';
    } else if (topicLower.includes('code') || topicLower.includes('programming') || 
               topicLower.includes('algorithm') || topicLower.includes('technical')) {
        return 'technical';
    } else if (topicLower.includes('art') || topicLower.includes('creative') || 
               topicLower.includes('story') || topicLower.includes('music')) {
        return 'creative';
    } else {
        return 'general';
    }
}

// Capitalize title
function capitalizeTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
}

// Display conversations in the grid
function displayConversations(conversations) {
    const grid = document.getElementById('conversationsGrid');
    
    if (conversations.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">🔍</div>
                <h3>No discussions found</h3>
                <p>Try adjusting your search or filter criteria.</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = conversations.map(conversation => `
        <div class="conversation-card" data-id="${conversation.id}" data-category="${conversation.category}">
            <div class="card-header">
                <div>
                    <h3 class="card-title">${conversation.title}</h3>
                </div>
                <span class="card-category">${conversation.category}</span>
            </div>
            <p class="card-preview">${conversation.preview}</p>
            <div class="card-meta">
                <div class="card-date">
                    <span>📅</span>
                    <span>${formatDate(conversation.date)}</span>
                </div>
                <div class="card-stats">
                    <div class="stat-item">
                        <span>💬</span>
                        <span>${conversation.messages}</span>
                    </div>
                    <div class="stat-item">
                        <span>🤖</span>
                        <span>${conversation.participants.length}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add click event listeners to conversation cards
    document.querySelectorAll('.conversation-card').forEach(card => {
        card.addEventListener('click', function() {
            const conversationId = this.dataset.id;
            openConversationModal(conversationId);
        });
    });
}

// Initialize search and filter functionality
function initSearchAndFilter() {
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        filterConversations(searchTerm, getCurrentFilter());
    });
    
    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            const searchTerm = searchInput.value.toLowerCase();
            filterConversations(searchTerm, filter);
        });
    });
}

// Filter conversations based on search and category
function filterConversations(searchTerm, category) {
    filteredConversations = allConversations.filter(conversation => {
        const matchesSearch = !searchTerm || 
            conversation.title.toLowerCase().includes(searchTerm) ||
            conversation.preview.toLowerCase().includes(searchTerm) ||
            conversation.category.toLowerCase().includes(searchTerm);
        
        const matchesCategory = category === 'all' || conversation.category === category;
        
        return matchesSearch && matchesCategory;
    });
    
    displayConversations(filteredConversations);
}

// Get current active filter
function getCurrentFilter() {
    const activeFilter = document.querySelector('.filter-btn.active');
    return activeFilter ? activeFilter.dataset.filter : 'all';
}

// Initialize modal functionality
function initModal() {
    const modal = document.getElementById('conversationModal');
    const closeBtn = document.getElementById('modalClose');
    const overlay = modal.querySelector('.modal-overlay');
    
    // Close modal events
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// Open conversation modal
function openConversationModal(conversationId) {
    const conversation = allConversations.find(c => c.id === conversationId);
    if (!conversation) return;
    
    const modal = document.getElementById('conversationModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = conversation.title;
    modalBody.innerHTML = renderConversation(conversation);
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close conversation modal
function closeModal() {
    const modal = document.getElementById('conversationModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Render conversation content for the new format
function renderConversation(conversation) {
    const data = conversation.originalData;
    
    // Filter out system messages and only show AI responses
    const aiMessages = data.messages.filter(msg => msg.role === 'assistant');
    
    let html = `
        <div class="conversation-content">
            <div class="discussion-info">
                <h4>Topic: ${data.topic}</h4>
                <p><strong>Participating AI Models:</strong> ${data.models.join(', ')}</p>
                <p><strong>Discussion Status:</strong> ${data.status}</p>
                <p><strong>Rounds:</strong> ${data.currentRound}/${data.maxRounds}</p>
            </div>
    `;
    
    // Group messages by round
    const messagesByRound = {};
    aiMessages.forEach(message => {
        const round = message.round || 1;
        if (!messagesByRound[round]) {
            messagesByRound[round] = [];
        }
        messagesByRound[round].push(message);
    });
    
    // Render messages by round
    Object.keys(messagesByRound).sort((a, b) => parseInt(a) - parseInt(b)).forEach(round => {
        html += `<div class="discussion-round">
            <h5>Round ${round}</h5>
        `;
        
        messagesByRound[round].forEach(message => {
            const timestamp = new Date(message.timestamp).toLocaleTimeString();
            html += `
                <div class="message ai">
                    <div class="message-header">
                        <div class="message-avatar">🤖</div>
                        <span class="message-sender">${message.modelName}</span>
                        <span class="message-time">${timestamp}</span>
                    </div>
                    <div class="message-content">${formatMessageContent(message.content)}</div>
                </div>
            `;
        });
        
        html += '</div>';
    });
    
    // Add summary if available
    if (data.summary) {
        html += `
            <div class="discussion-summary">
                <h5>Discussion Summary</h5>
                <div class="summary-content">
                    ${formatMessageContent(data.summary.content)}
                </div>
                <p class="summary-meta">Generated by: ${data.summary.generatedBy}</p>
            </div>
        `;
    }
    
    html += '</div>';
    return html;
}

// Format message content (handle code blocks, etc.)
function formatMessageContent(content) {
    // Handle thinking blocks (for models that show reasoning)
    content = content.replace(/<think>([\s\S]*?)<\/think>/g, 
        '<details class="thinking-block"><summary>🤔 Reasoning Process</summary><div class="thinking-content">$1</div></details>');
    
    // Simple formatting
    return content
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Hide loading spinner
function hideLoading() {
    const loadingContainer = document.querySelector('.loading-container');
    if (loadingContainer) {
        loadingContainer.style.display = 'none';
    }
}

// Show error message
function showError(message) {
    const grid = document.getElementById('conversationsGrid');
    grid.innerHTML = `
        <div class="error-container">
            <div class="error-icon">⚠️</div>
            <h3>Error Loading Discussions</h3>
            <p>${message}</p>
            <button onclick="location.reload()" class="retry-btn">Retry</button>
        </div>
    `;
}

// Matrix rain effect
function createMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.05';
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
    
    setInterval(drawMatrix, 100);
}

function initParticleSystem() {
    // Simplified particle system
    setInterval(() => {
        if (Math.random() < 0.3) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.width = '2px';
            particle.style.height = '2px';
            particle.style.background = '#00ffff';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '-1';
            particle.style.left = Math.random() * window.innerWidth + 'px';
            particle.style.top = Math.random() * window.innerHeight + 'px';
            particle.style.opacity = '0.5';
            
            document.body.appendChild(particle);
            
            particle.animate([
                { transform: 'scale(1)', opacity: 0.5 },
                { transform: 'scale(0)', opacity: 0 }
            ], {
                duration: 2000,
                easing: 'ease-out'
            }).onfinish = () => {
                particle.remove();
            };
        }
    }, 1000);
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
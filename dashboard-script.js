/* ===========================
   TRADEX Dashboard - JavaScript
   =========================== */

// ===========================
// CHART INITIALIZATION
// ===========================

let tradingChart = null;
let accountChart = null;

// Initialize Trading Chart
function initTradingChart() {
    const ctx = document.getElementById('tradingChart');
    
    if (!ctx) return;

    // Generate sample data
    const labels = generateTimeLabels(30);
    const data = generateChartData(30, 40000, 45000);

    tradingChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'BTC/USD',
                    data: data,
                    borderColor: '#2948ff',
                    backgroundColor: 'rgba(41, 72, 255, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 8,
                    pointBackgroundColor: '#00ff84',
                    pointBorderColor: '#00d4ff',
                    pointBorderWidth: 2,
                    hoverBackgroundColor: 'rgba(41, 72, 255, 0.2)',
                    clip: false,
                    borderJoinStyle: 'round',
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#a8adc6',
                        font: {
                            family: "'Poppins', sans-serif",
                            size: 14,
                            weight: '600',
                        },
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 15,
                    },
                },
                tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(26, 31, 58, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#a8adc6',
                    borderColor: '#2948ff',
                    borderWidth: 1,
                    titleFont: {
                        family: "'Poppins', sans-serif",
                        size: 12,
                        weight: '700',
                    },
                    bodyFont: {
                        family: "'Poppins', sans-serif",
                        size: 11,
                    },
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        label: function (context) {
                            return 'Price: $' + context.parsed.y.toFixed(2);
                        },
                    },
                },
            },
            scales: {
                x: {
                    display: true,
                    grid: {
                        color: 'rgba(73, 72, 255, 0.1)',
                        drawBorder: false,
                    },
                    ticks: {
                        color: '#a8adc6',
                        font: {
                            family: "'Poppins', sans-serif",
                            size: 11,
                        },
                        maxRotation: 0,
                    },
                },
                y: {
                    display: true,
                    position: 'right',
                    grid: {
                        color: 'rgba(73, 72, 255, 0.1)',
                        drawBorder: false,
                    },
                    ticks: {
                        color: '#a8adc6',
                        font: {
                            family: "'Poppins', sans-serif",
                            size: 11,
                        },
                        callback: function (value) {
                            return '$' + value.toFixed(0);
                        },
                    },
                },
            },
        },
    });
}

// Initialize Account Summary Doughnut Chart
function initAccountChart() {
    const ctx = document.getElementById('accountChart');
    
    if (!ctx) return;

    accountChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Equity', 'Used Margin', 'Available Margin'],
            datasets: [
                {
                    data: [24350.75, 5680.40, 18670.35],
                    backgroundColor: ['#00ff84', '#2948ff', '#4f46e5'],
                    borderColor: '#0a0e27',
                    borderWidth: 3,
                    hoverOffset: 10,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '70%',
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 31, 58, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#a8adc6',
                    borderColor: '#2948ff',
                    borderWidth: 1,
                    titleFont: {
                        family: "'Poppins', sans-serif",
                        size: 12,
                        weight: '700',
                    },
                    bodyFont: {
                        family: "'Poppins', sans-serif",
                        size: 11,
                    },
                    padding: 12,
                    callbacks: {
                        label: function (context) {
                            return '$' + context.parsed.toFixed(2);
                        },
                    },
                },
            },
        },
    });
}

// ===========================
// UTILITY FUNCTIONS
// ===========================

// Generate time labels
function generateTimeLabels(count) {
    const labels = [];
    for (let i = count; i > 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    return labels;
}

// Generate realistic chart data
function generateChartData(count, min, max) {
    const data = [];
    let lastValue = (min + max) / 2;

    for (let i = 0; i < count; i++) {
        const change = (Math.random() - 0.5) * 500;
        const newValue = Math.max(min, Math.min(max, lastValue + change));
        data.push(newValue);
        lastValue = newValue;
    }

    return data;
}

// ===========================
// EVENT LISTENERS
// ===========================

// Chart Tab Switching
document.addEventListener('DOMContentLoaded', () => {
    const chartTabs = document.querySelectorAll('.chart-tab');

    chartTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all tabs
            chartTabs.forEach(t => t.classList.remove('active'));

            // Add active class to clicked tab
            tab.classList.add('active');

            // Get period
            const period = tab.getAttribute('data-period');

            // Update chart based on period
            updateChartData(period);
        });
    });

    // Navigation items click
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();

            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Handle navigation
            const href = item.getAttribute('href');
            if (href !== '#') {
                console.log('Navigating to:', href);
            }
        });
    });

    // Market table row click
    const marketRows = document.querySelectorAll('.market-row');
    marketRows.forEach(row => {
        row.addEventListener('click', () => {
            const pair = row.querySelector('.pair-name').textContent;
            console.log('Clicked on market:', pair);
        });

        row.addEventListener('mouseenter', () => {
            row.style.transform = 'translateX(5px)';
        });

        row.addEventListener('mouseleave', () => {
            row.style.transform = 'translateX(0)';
        });
    });

    // Profile section click
    const profileSection = document.querySelector('.profile-section');
    if (profileSection) {
        profileSection.addEventListener('click', () => {
            console.log('Profile clicked');
            // Could open profile menu here
        });
    }

    // Notification button click
    const notificationBtn = document.querySelector('.notification-btn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', () => {
            console.log('Notifications clicked');
            // Could show notifications here
        });
    }

    // Initialize charts
    initTradingChart();
    initAccountChart();

    // Add hover effects to stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
});

// Update chart data based on selected period
function updateChartData(period) {
    if (!tradingChart) return;

    let dataCount = 30;
    let minValue = 40000;
    let maxValue = 45000;

    switch (period) {
        case '1D':
            dataCount = 24;
            break;
        case '1W':
            dataCount = 7;
            break;
        case '1M':
            dataCount = 30;
            break;
        case '1Y':
            dataCount = 52;
            minValue = 38000;
            maxValue = 48000;
            break;
    }

    tradingChart.data.labels = generateTimeLabels(dataCount);
    tradingChart.data.datasets[0].data = generateChartData(dataCount, minValue, maxValue);
    tradingChart.update('active');
}

// ===========================
// REAL-TIME UPDATES
// ===========================

// Simulate real-time data updates
function updateRealtimeData() {
    const balanceElement = document.querySelector('.stat-cards .stat-value');
    if (balanceElement) {
        // Update would happen here
    }
}

// Update every 5 seconds
setInterval(updateRealtimeData, 5000);

// ===========================
// ANIMATIONS
// ===========================

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = entry.target.dataset.animation || 'slideInUp 0.5s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply animations on page load
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('[data-animation]');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
});

// ===========================
// RESPONSIVE BEHAVIOR
// ===========================

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (tradingChart) {
            tradingChart.resize();
        }
        if (accountChart) {
            accountChart.resize();
        }
    }, 250);
});

// ===========================
// UTILITY - Format Currency
// ===========================

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value);
}

// ===========================
// MOBILE MENU
// ===========================

function toggleMobileMenu() {
    const navbar = document.querySelector('.bottom-navbar');
    if (navbar) {
        navbar.classList.toggle('active');
    }
}

// ===========================
// LOCAL STORAGE
// ===========================

// Save user preferences
function savePreferences() {
    const preferences = {
        theme: 'dark',
        notifications: true,
        language: 'en',
    };
    localStorage.setItem('tradexPreferences', JSON.stringify(preferences));
}

// Load user preferences
function loadPreferences() {
    const saved = localStorage.getItem('tradexPreferences');
    if (saved) {
        return JSON.parse(saved);
    }
    return null;
}

// ===========================
// PERFORMANCE OPTIMIZATION
// ===========================

// Lazy load images
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// ===========================
// EXPORT FUNCTIONS
// ===========================

// Allow external access to key functions if needed
window.TRADEX = {
    formatCurrency,
    toggleMobileMenu,
    updateChartData,
    savePreferences,
    loadPreferences,
};

console.log('✅ TRADEX Dashboard initialized successfully!');

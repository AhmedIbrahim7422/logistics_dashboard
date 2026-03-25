document.addEventListener('DOMContentLoaded', function() {
    
    // Translation Logic
    const currentLang = localStorage.getItem('lang') || 'en';
    
    function applyTranslations(lang) {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (window.translations && window.translations[lang] && window.translations[lang][key]) {
                if (el.tagName === 'INPUT' && el.type === 'text') {
                    el.placeholder = window.translations[lang][key];
                } else {
                    el.innerText = window.translations[lang][key];
                }
            }
        });
        
        // Update RTL
        if (lang === 'ar') {
            document.documentElement.dir = 'rtl';
            document.documentElement.lang = 'ar';
            document.body.style.fontFamily = "'Inter', 'Cairo', sans-serif";
        } else {
            document.documentElement.dir = 'ltr';
            document.documentElement.lang = 'en';
            document.body.style.fontFamily = "'Inter', sans-serif";
        }
    }
    
    // Initial apply
    applyTranslations(currentLang);

    // Lang Switcher Event
    const langSwitchBtn = document.getElementById('langSwitcher');
    if (langSwitchBtn) {
        langSwitchBtn.addEventListener('click', () => {
            const newLang = localStorage.getItem('lang') === 'ar' ? 'en' : 'ar';
            localStorage.setItem('lang', newLang);
            location.reload(); // Quick reload for simplicity to re-init charts/etc
        });
        // Update switcher text
        langSwitchBtn.innerText = currentLang === 'en' ? 'Arabic' : 'English';
    }

    
    // Shared Chart Configuration Settings
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = '#6b7280';
    Chart.defaults.borderColor = '#f3f4f6';

    // 1) Main Chart (Bar + Line) - Shipment Volume & Transit Time
    const ctxShipment = document.getElementById('shipmentChart').getContext('2d');
    
    // Gradient for bars
    const barGradient = ctxShipment.createLinearGradient(0, 0, 0, 400);
    barGradient.addColorStop(0, '#3b82f6'); // brandBlue
    barGradient.addColorStop(1, '#60a5fa'); 

    new Chart(ctxShipment, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                {
                    type: 'line',
                    label: 'Avg Transit Time (hrs)',
                    data: [14.2, 12.8, 15.5, 13.0, 11.5, 10.2, 8.5],
                    borderColor: '#f97316', // accentOrange
                    backgroundColor: '#f97316',
                    borderWidth: 2,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#f97316',
                    pointBorderWidth: 2,
                    yAxisID: 'y1',
                    order: 0
                },
                {
                    type: 'bar',
                    label: 'Volume (Packages)',
                    data: [420, 510, 390, 480, 550, 310, 260],
                    backgroundColor: barGradient,
                    borderRadius: 6,
                    borderSkipped: false,
                    barPercentage: 0.6,
                    categoryPercentage: 0.8,
                    yAxisID: 'y',
                    order: 1
                }
            ]
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
                    position: 'top',
                    align: 'end',
                    labels: {
                        usePointStyle: true,
                        boxWidth: 8,
                        font: { size: 12, weight: '500' }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    titleFont: { size: 13, family: 'Inter' },
                    bodyFont: { size: 13, family: 'Inter' },
                    padding: 12,
                    cornerRadius: 8,
                    boxPadding: 4
                }
            },
            scales: {
                x: {
                    grid: { display: false }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    beginAtZero: true,
                    grid: { borderDash: [4, 4] },
                    title: { display: true, text: 'Volume', font: { size: 11 } }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    beginAtZero: true,
                    title: { display: true, text: 'Hours', font: { size: 11 } },
                    grid: { drawOnChartArea: false }, 
                    min: 0,
                    max: 20
                }
            }
        }
    });

    // 2) Secondary Chart (Doughnut) - Fleet Status
    const ctxFleet = document.getElementById('fleetStatusChart').getContext('2d');
    new Chart(ctxFleet, {
        type: 'doughnut',
        data: {
            labels: ['In Transit', 'Loading', 'Idle', 'Maintenance'],
            datasets: [{
                data: [72, 15, 8, 5],
                backgroundColor: [
                    '#3b82f6', // In transit (blue)
                    '#c084fc', // Loading (purple)
                    '#d1d5db', // Idle (gray)
                    '#f87171'  // Maintenance (red)
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
                legend: {
                    display: false, // Hidden standard legend since we use custom HTML legend
                },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    callbacks: {
                        label: function(context) {
                            return ' ' + context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });
});

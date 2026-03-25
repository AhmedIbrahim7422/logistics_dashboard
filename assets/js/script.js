/**
 * NexusTrack - Core Logic & Data Visualization
 * This file handles translation switching, RTL toggling, and Chart.js initialization.
 */

document.addEventListener('DOMContentLoaded', function() {
    
    /* ==========================================================================
       Language & Localization Engine (i18n)
       ========================================================================== */
    const currentLang = localStorage.getItem('lang') || 'en';
    
    /**
     * Applies translations to all elements with [data-i18n] attribute
     * @param {string} lang - 'en' or 'ar'
     */
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
        
        // Update Document Direction and Language attributes
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
    
    // Initial Application of Language
    applyTranslations(currentLang);

    /* ==========================================================================
       UI Event Listeners
       ========================================================================== */
    // Mobile Menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');

    if (mobileMenuBtn && sidebar) {
        const overlay = document.createElement('div');
        overlay.id = 'mobileOverlay';
        overlay.className = 'fixed inset-0 bg-black/50 z-40 hidden md:hidden transition-opacity';
        document.body.appendChild(overlay);

        function toggleMenu() {
            sidebar.classList.toggle('open-sidebar');
            overlay.classList.toggle('hidden');
        }

        mobileMenuBtn.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);

        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768) {
                sidebar.classList.remove('open-sidebar');
                overlay.classList.add('hidden');
            }
        });
    }

    const langSwitchBtn = document.getElementById('langSwitcher');
    if (langSwitchBtn) {
        langSwitchBtn.addEventListener('click', () => {
            const newLang = localStorage.getItem('lang') === 'ar' ? 'en' : 'ar';
            localStorage.setItem('lang', newLang);
            // Reload to ensure all components (like Charts) re-render with target direction
            location.reload(); 
        });
        // Update switcher button text based on current state
        langSwitchBtn.innerText = currentLang === 'en' ? 'Arabic' : 'English';
    }

    
    /* ==========================================================================
       Chart.js Global Configurations
       ========================================================================== */
    if (typeof Chart !== 'undefined') {
        Chart.defaults.font.family = "'Inter', sans-serif";
        Chart.defaults.color = '#6b7280';
        Chart.defaults.borderColor = '#f3f4f6';

        // Connect Charts to Mock API
        if (typeof MockAPI !== 'undefined' && document.getElementById('shipmentChart')) {
            MockAPI.getDashboardCharts().then(chartData => {
                // 1) Shipment Volume Chart (Bar + Line)
                const shipmentEl = document.getElementById('shipmentChart');
                const ctxShipment = shipmentEl.getContext('2d');
                const barGradient = ctxShipment.createLinearGradient(0, 0, 0, 400);
                barGradient.addColorStop(0, '#3b82f6'); 
                barGradient.addColorStop(1, '#60a5fa'); 

                new Chart(ctxShipment, {
                    type: 'bar',
                    data: {
                        labels: chartData.shipmentVolume.labels,
                        datasets: [
                            {
                                type: 'line',
                                label: 'Avg Transit Time (hrs)',
                                data: chartData.shipmentVolume.avgTransitTime,
                                borderColor: '#f97316',
                                backgroundColor: '#f97316',
                                borderWidth: 2,
                                tension: 0.4,
                                yAxisID: 'y1'
                            },
                            {
                                type: 'bar',
                                label: 'Volume (Packages)',
                                data: chartData.shipmentVolume.volume,
                                backgroundColor: barGradient,
                                borderRadius: 6,
                                yAxisID: 'y'
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: { position: 'left', beginAtZero: true },
                            y1: { position: 'right', beginAtZero: true, grid: { display: false } }
                        }
                    }
                });

                // 2) Fleet Status Chart (Doughnut)
                const fleetEl = document.getElementById('fleetStatusChart');
                if (fleetEl) {
                    const ctxFleet = fleetEl.getContext('2d');
                    new Chart(ctxFleet, {
                        type: 'doughnut',
                        data: {
                            labels: chartData.fleetStatus.labels,
                            datasets: [{
                                data: chartData.fleetStatus.data,
                                backgroundColor: ['#3b82f6', '#c084fc', '#d1d5db', '#f87171'],
                                borderWidth: 0
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            cutout: '75%',
                            plugins: { legend: { display: false } }
                        }
                    });
                }
            });
        }
    }

    /* ==========================================================================
       Mock API Data Rendering
       ========================================================================== */
    if (typeof MockAPI !== 'undefined') {
        
        // 1. Render Dashboard KPIs
        if (document.getElementById('kpiActiveShipments')) {
            MockAPI.getDashboardKPIs().then(data => {
                document.getElementById('kpiActiveShipments').innerText = data.activeShipments.value;
                document.getElementById('kpiOnTimeDelivery').innerText = data.onTimeDelivery.value;
                document.getElementById('kpiFleetUtilization').innerHTML = `${data.fleetUtilization.active} <span class="text-lg text-gray-400 font-medium">/ ${data.fleetUtilization.total}</span>`;
                document.getElementById('kpiCriticalAlerts').innerText = data.criticalAlerts.count;
            });
        }

        // 2. Render Dashboard Tracking Log Table
        const trackingLogTable = document.getElementById('trackingLogTable');
        if (trackingLogTable) {
            MockAPI.getTrackingLogs().then(logs => {
                trackingLogTable.innerHTML = '';
                logs.forEach(log => {
                    const statusBgMap = {
                        'blue': 'bg-blue-50 text-blue-600 border-blue-100',
                        'green': 'bg-green-50 text-green-600 border-green-100',
                        'red': 'bg-red-50 text-red-600 border-red-100',
                        'purple': 'bg-purple-50 text-purple-600 border-purple-100',
                        'orange': 'bg-orange-50 text-orange-600 border-orange-100'
                    };
                    const badgeClass = statusBgMap[log.statusColor] || 'bg-gray-50 text-gray-600 border-gray-100';
                    const routeSplit = log.route.split('➝');
                    
                    trackingLogTable.innerHTML += `
                        <tr class="hover:bg-gray-50 transition-colors group">
                            <td class="px-4 py-3 sm:px-6 sm:py-4 font-medium text-gray-800 group-hover:text-brandBlue transition-colors">
                                <a href="#">${log.id}</a>
                            </td>
                            <td class="px-4 py-3 sm:px-6 sm:py-4 text-gray-600">
                                <div class="flex items-center gap-2">
                                    <span class="font-medium">${routeSplit[0].trim()}</span>
                                    <i class="fa-solid fa-arrow-right text-gray-300 text-xs"></i>
                                    <span class="font-medium">${routeSplit[1] ? routeSplit[1].trim() : ''}</span>
                                </div>
                            </td>
                            <td class="px-4 py-3 sm:px-6 sm:py-4">
                                <div class="flex items-center gap-3">
                                    <img src="https://i.pravatar.cc/150?img=${log.driverImg}" alt="Driver" class="w-6 h-6 rounded-full object-cover">
                                    <span class="text-gray-700 font-medium">${log.driver}</span>
                                </div>
                            </td>
                            <td class="px-4 py-3 sm:px-6 sm:py-4">
                                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${badgeClass} border border-solid">
                                    <span class="w-1.5 h-1.5 rounded-full bg-${log.statusColor}-500 mr-1.5"></span>
                                    ${log.status}
                                </span>
                            </td>
                            <td class="px-4 py-3 sm:px-6 sm:py-4 text-right text-gray-600 font-medium">${log.eta}</td>
                        </tr>
                    `;
                });
            });
        }

        // 3. Render Fleet Status Grid
        const fleetStatusGrid = document.getElementById('fleetStatusGrid');
        if (fleetStatusGrid) {
            MockAPI.getFleetStatus().then(fleet => {
                fleetStatusGrid.innerHTML = '';
                fleet.forEach(v => {
                    const statusClass = v.statusColor === 'green' ? 'bg-green-50 text-successGreen' : 'bg-red-50 text-dangerRed';
                    
                    fleetStatusGrid.innerHTML += `
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div class="flex justify-between items-center mb-4">
                                <span class="text-lg font-bold text-gray-800 tracking-tight">${v.id}</span>
                                <span class="px-2 py-1 ${statusClass} text-[10px] font-bold uppercase rounded-md">${v.status}</span>
                            </div>
                            <div class="space-y-3 text-sm">
                                <div class="flex justify-between"><span class="text-gray-500">Model:</span><span class="text-gray-800 font-medium">${v.model}</span></div>
                                <div class="flex justify-between"><span class="text-gray-500">Driver:</span><span class="text-gray-800 font-medium">${v.driver}</span></div>
                                <div class="flex justify-between"><span class="text-gray-500">Fuel Level:</span><span class="text-emerald-500 font-bold">${v.fuel}</span></div>
                            </div>
                        </div>
                    `;
                });
            });
        }

        // 4. Render Shipments Table
        const shipmentsTableBody = document.getElementById('shipmentsTableBody');
        if (shipmentsTableBody) {
            MockAPI.getShipments().then(shipments => {
                shipmentsTableBody.innerHTML = '';
                shipments.forEach(shp => {
                    const statusBgMap = {
                        'blue': 'bg-blue-50 text-blue-600 border-blue-100',
                        'green': 'bg-green-50 text-green-600 border-green-100',
                        'red': 'bg-red-50 text-red-600 border-red-100'
                    };
                    const badgeClass = statusBgMap[shp.statusColor] || 'bg-gray-50 text-gray-600 border-gray-100';
                    
                    shipmentsTableBody.innerHTML += `
                        <tr class="hover:bg-gray-50/80 transition-colors">
                            <td class="px-4 py-3 sm:px-6 sm:py-4 font-bold text-gray-700">${shp.id}</td>
                            <td class="px-4 py-3 sm:px-6 sm:py-4 text-gray-600 font-medium">${shp.destination}</td>
                            <td class="px-4 py-3 sm:px-6 sm:py-4 text-gray-500">${shp.weight}</td>
                            <td class="px-4 py-3 sm:px-6 sm:py-4">
                                <span class="px-2.5 py-1 ${badgeClass} rounded-full text-[11px] font-bold border border-solid">${shp.status}</span>
                            </td>
                            <td class="px-4 py-3 sm:px-6 sm:py-4">
                                <button class="text-brandBlue font-semibold text-xs hover:underline">Details</button>
                            </td>
                        </tr>
                    `;
                });
            });
        }

        // 5. Render Alerts List
        const alertsListContainer = document.getElementById('alertsListContainer');
        if (alertsListContainer) {
            MockAPI.getAlerts().then(alerts => {
                alertsListContainer.innerHTML = '';
                alerts.forEach(alert => {
                    const isCritical = alert.type === 'critical';
                    const borderColor = isCritical ? 'border-dangerRed' : 'border-accentOrange';
                    const iconColor = isCritical ? 'bg-red-50 text-dangerRed border-red-100' : 'bg-orange-50 text-accentOrange border-orange-100';
                    const icon = isCritical ? 'fa-triangle-exclamation animate-pulse' : 'fa-route';
                    const highlightColor = isCritical ? 'text-dangerRed' : 'text-accentOrange';
                    
                    alertsListContainer.innerHTML += `
                        <div class="bg-white p-6 rounded-2xl border-l-[6px] ${borderColor} shadow-sm flex items-start gap-5 hover:shadow-md transition-shadow">
                            <div class="h-12 w-12 ${iconColor} rounded-2xl flex items-center justify-center shrink-0 border border-solid">
                                <i class="fa-solid ${icon} text-xl"></i>
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="flex justify-between items-start mb-1">
                                    <h4 class="font-bold text-gray-800">${alert.title}</h4>
                                    <span class="text-[10px] text-gray-400 font-bold tracking-widest uppercase">${alert.time}</span>
                                </div>
                                <p class="text-sm text-gray-600 leading-relaxed mb-4">
                                    Vehicle <span class="font-bold ${highlightColor}">${alert.vehicleId}</span> ${alert.desc}
                                </p>
                                ${isCritical ? `
                                <div class="flex gap-3">
                                     <button class="text-xs font-bold bg-brandBlue text-white px-4 py-2 rounded-lg shadow-sm active:scale-95 transition-all">Call Driver</button>
                                     <button class="text-xs font-bold text-gray-500 bg-gray-50 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all">Dismiss</button>
                                </div>
                                ` : ''}
                            </div>
                        </div>
                    `;
                });
            });
        }

        // 6. Render Live Map Active Fleet List
        const liveMapFleetList = document.getElementById('liveMapFleetList');
        if (liveMapFleetList) {
            MockAPI.getLiveMapFleet().then(fleet => {
                liveMapFleetList.innerHTML = '';
                fleet.forEach(v => {
                    const speedColor = v.speed === '0 km/h' ? 'bg-gray-500' : (parseInt(v.speed) < 50 ? 'bg-orange-500' : 'bg-blue-500');
                    liveMapFleetList.innerHTML += `
                        <div class="p-3 bg-blue-50 border border-blue-100 rounded-xl cursor-pointer hover:bg-blue-100 transition-colors">
                            <div class="flex justify-between items-start mb-1">
                                <span class="text-xs font-bold text-brandBlue">${v.id}</span>
                                <span class="text-[10px] ${speedColor} text-white px-1.5 py-0.5 rounded">${v.speed}</span>
                            </div>
                            <p class="text-xs font-medium text-gray-700">${v.route}</p>
                        </div>
                    `;
                });
            });
        }

    }
});

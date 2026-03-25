/**
 * NexusTrack - Mock API & Data Services
 * This file simulates a backend connection. In a real application, 
 * these functions would be replaced with actual fetch/axios calls to your API.
 */

const MockAPI = {
    // 1. Dashboard KPIs
    getDashboardKPIs: async () => {
        return {
            activeShipments: { value: "1,492", trend: 124, isUp: true },
            onTimeDelivery: { value: "94.2%", trend: 0.8, isUp: false, reason: "due to weather" },
            fleetUtilization: { active: 184, total: 210 },
            criticalAlerts: { count: 3, alerts: [
                { id: "TRK-89420A", type: "Engine Temp High", color: "dangerRed" },
                { id: "TRK-10294B", type: "Off Route Deviation", color: "accentOrange" }
            ]}
        };
    },

    // 2. Dashboard Charts Data
    getDashboardCharts: async () => {
        return {
            shipmentVolume: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                volume: [420, 510, 390, 480, 550, 310, 260],
                avgTransitTime: [14.2, 12.8, 15.5, 13.0, 11.5, 10.2, 8.5]
            },
            fleetStatus: {
                labels: ['In Transit', 'Loading', 'Idle', 'Maintenance'],
                data: [72, 15, 8, 5]
            }
        };
    },

    // 3. Live Tracking Logs (Dashboard)
    getTrackingLogs: async () => {
        return [
            { id: "#TRK-89420A", route: "Alexandria ➝ Cairo", driver: "Omar Hassan", driverImg: "11", status: "In Transit", statusColor: "blue", eta: "Today, 18:30" },
            { id: "#TRK-90511B", route: "Suez ➝ Port Said", driver: "Ahmed Youssef", driverImg: "8", status: "Delivered", statusColor: "green", eta: "Today, 10:15" },
            { id: "#TRK-88390C", route: "Cairo ➝ Aswan", driver: "Tarek Fahmy", driverImg: "3", status: "Delayed", statusColor: "red", eta: "Tomorrow, 12:00" },
            { id: "#TRK-91024D", route: "Damietta ➝ Tanta", driver: "Kareem Ali", driverImg: "15", status: "Loading", statusColor: "purple", eta: "Today, 20:00" },
            { id: "#TRK-89955E", route: "Luxor ➝ Hurghada", driver: "Mahmoud Zaki", driverImg: "53", status: "Rerouted", statusColor: "orange", eta: "Tomorrow, 09:30" }
        ];
    },

    // 4. Live Map Fleet Data
    getLiveMapFleet: async () => {
        return [
            { id: "#TRK-89420A", speed: "65 km/h", route: "Alexandria ➝ Cairo" },
            { id: "#TRK-90511B", speed: "0 km/h", route: "Suez ➝ Port Said (Delivered)" },
            { id: "#TRK-88390C", speed: "40 km/h", route: "Cairo ➝ Aswan (Delayed)" }
        ];
    },

    // 5. Fleet Detailed Status
    getFleetStatus: async () => {
        return [
            { id: "V-10294-B", status: "Operational", statusColor: "green", model: "Scania R450", driver: "Ahmed Youssef", fuel: "82%" },
            { id: "V-33921-C", status: "In Repair", statusColor: "red", model: "Volvo FH16", driver: "Unassigned", fuel: "15%" },
            { id: "V-55012-A", status: "Operational", statusColor: "green", model: "Mercedes-Benz Actros", driver: "Omar Hassan", fuel: "95%" }
        ];
    },

    // 6. Shipments Data
    getShipments: async () => {
        return [
            { id: "#SHP-77421", destination: "New York, USA", weight: "12,400 kg", status: "Processing", statusColor: "blue" },
            { id: "#SHP-77422", destination: "Dubai, UAE", weight: "8,150 kg", status: "Manifested", statusColor: "green" },
            { id: "#SHP-77423", destination: "London, UK", weight: "3,200 kg", status: "Delayed", statusColor: "red" },
            { id: "#SHP-77424", destination: "Tokyo, Japan", weight: "15,000 kg", status: "In Transit", statusColor: "blue" }
        ];
    },

    // 7. System Alerts
    getAlerts: async () => {
        return [
            { title: "Engine Overheat Critical", type: "critical", time: "2 mins ago", vehicleId: "#TRK-89420A", desc: "reported a temperature spike above 105°C during the Alexandria-Cairo Desert Road crossing." },
            { title: "Geofence Deviation", type: "warning", time: "15 mins ago", vehicleId: "#TRK-10294B", desc: "has deviated from the planned route in the Port Said industrial district. Contact driver for verification." }
        ];
    }
};

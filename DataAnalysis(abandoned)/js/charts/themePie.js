import { chartManager } from './index.js';

export function renderThemePie(rows) {
    const map = {};
    const colors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    
    rows.forEach(r => {
        const duration = (new Date(r.end) - new Date(r.start)) / 60000;
        map[r.theme] = (map[r.theme] || 0) + duration;
    });
    
    chartManager.create('themePie', 'pie', {
        labels: Object.keys(map),
        datasets: [{
            data: Object.values(map),
            backgroundColor: colors.slice(0, Object.keys(map).length),
            borderWidth: 0
        }]
    }, {
        plugins: {
            legend: { position: 'right', labels: { boxWidth: 12 } }
        }
    });
}
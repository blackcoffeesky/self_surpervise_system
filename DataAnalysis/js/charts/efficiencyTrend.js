import { chartManager } from './index.js';

export function renderEfficiencyTrend(rows) {
    const days = [...new Set(rows.map(r => r.start.slice(0,10)))].sort();
    
    const avgPerDay = days.map(d => {
        const dayRows = rows.filter(r => 
            r.start.slice(0,10) === d && r.efficiency !== 5
        );
        if (dayRows.length === 0) return null;
        return Number((dayRows.reduce((s, r) => s + r.efficiency, 0) / dayRows.length).toFixed(2));
    });
    
    chartManager.create('efficiencyLine', 'line', {
        labels: days,
        datasets: [{
            label: '每日平均效率',
            data: avgPerDay,
            borderColor: '#4f46e5',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            borderWidth: 3,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.3,
            fill: true
        }]
    }, {
        plugins: { legend: { display: false } }
    });
}
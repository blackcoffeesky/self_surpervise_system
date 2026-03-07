import { chartManager } from './index.js';

export function renderEfficiencyBar(rows) {
    const dist = {0:0, 1:0, 2:0, 3:0, 4:0, 5:0};
    
    rows.forEach(r => {
        dist[r.efficiency]++;
    });
    
    chartManager.create('efficiencyBar', 'bar', {
        labels: ['低 (0)', '偏低 (1)', '正常 (2)', '高 (3)', '极高 (4)', '无 (5)'],
        datasets: [{
            label: '记录数量',
            data: Object.values(dist),
            backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#94a3b8'],
            borderRadius: 6
        }]
    }, {
        plugins: { legend: { display: false } },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { stepSize: 1, precision: 0 }
            }
        }
    });
}
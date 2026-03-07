import { chartManager } from './index.js';

export function renderThemeDurationLine(rows) {
    const map = {};
    
    rows.forEach(r => {
        const day = r.start.slice(0,10);
        const duration = (new Date(r.end) - new Date(r.start)) / 60000;
        const key = `${day}|${r.theme}`;
        map[key] = (map[key] || 0) + duration;
    });
    
    const days = [...new Set(rows.map(r => r.start.slice(0,10)))].sort();
    const themes = [...new Set(rows.map(r => r.theme))];
    
    const datasets = themes.map((t, index) => ({
        label: t,
        data: days.map(d => map[`${d}|${t}`] || 0),
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.3,
        borderColor: `hsl(${index * 45}, 70%, 50%)`,
        backgroundColor: `hsla(${index * 45}, 70%, 50%, 0.1)`
    }));
    
    chartManager.create('themeDurationLine', 'line', {
        labels: days,
        datasets: datasets
    }, {
        plugins: {
            legend: { position: 'top', labels: { boxWidth: 12 } }
        }
    });
}
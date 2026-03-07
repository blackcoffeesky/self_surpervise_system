// 图表管理器
class ChartManager {
    constructor() {
        this.charts = {};
    }
    
    create(chartId, type, data, options = {}) {
        this.destroy(chartId);
        
        const ctx = document.getElementById(chartId)?.getContext('2d');
        if (!ctx) return null;
        
        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 500 },
            ...options
        };
        
        this.charts[chartId] = new Chart(ctx, {
            type,
            data,
            options: defaultOptions
        });
        
        return this.charts[chartId];
    }
    
    destroy(chartId) {
        if (this.charts[chartId]) {
            this.charts[chartId].destroy();
            this.charts[chartId] = null;
        }
    }
    
    resize(chartId) {
        if (this.charts[chartId]) {
            this.charts[chartId].resize();
        }
    }
    
    resizeAll() {
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.resize();
        });
    }
    
    destroyAll() {
        Object.keys(this.charts).forEach(id => this.destroy(id));
    }
}

export const chartManager = new ChartManager();
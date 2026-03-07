import { chartManager } from '../charts/index.js';
import { debounce } from '../utils/throttler.js';

export class ResizeHandler {
    constructor() {
        this.init();
    }
    
    init() {
        window.addEventListener('resize', debounce(() => {
            chartManager.resizeAll();
        }, 150));
    }
    
    handleChartResize(chartId, type, value) {
        const canvas = document.getElementById(chartId);
        if (!canvas) return;
        
        if (type === 'height') {
            canvas.style.height = value + 'px';
        } else if (type === 'width') {
            canvas.style.width = value + '%';
        }
        
        // 延迟重绘，避免频繁更新
        if (this.resizeTimer?.[chartId]) {
            clearTimeout(this.resizeTimer[chartId]);
        }
        
        this.resizeTimer = this.resizeTimer || {};
        this.resizeTimer[chartId] = setTimeout(() => {
            chartManager.resize(chartId);
        }, 50);
    }
}

export const resizeHandler = new ResizeHandler();
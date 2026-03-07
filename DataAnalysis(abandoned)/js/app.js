import { dbManager } from './database.js';
import { chartManager } from './charts/index.js';
import { renderThemeDurationLine } from './charts/themeDurationLine.js';
import { renderEfficiencyTrend } from './charts/efficiencyTrend.js';
import { renderThemePie } from './charts/themePie.js';
import { renderEfficiencyBar } from './charts/efficiencyBar.js';
import { ControlsManager } from './ui/controls.js';
import { updateStats } from './ui/stats.js';
import { resizeHandler } from './ui/resizeHandler.js';
import { renderThrottle, handleError } from './utils/throttler.js';
import { validateDates } from './utils/validators.js';

class App {
    constructor() {
        this.controls = new ControlsManager((chartId, type, value) => {
            resizeHandler.handleChartResize(chartId, type, value);
        });
        
        this.renderThrottled = renderThrottle(() => this._renderDashboard(), 300);
    }
    
    async init() {
        try {
            const success = await dbManager.init();
            if (!success) return;
            
            this.initEventListeners();
            this.controls.init();
            
            console.log('应用初始化完成');
        } catch (error) {
            handleError(error, '应用初始化失败');
        }
    }
    
    initEventListeners() {
        document.getElementById('dbFile').addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            try {
                await dbManager.loadFromFile(file);
                this.initDateRange();
                this.renderDashboard();
            } catch (error) {
                handleError(error, '加载数据库失败');
            }
        });
    }
    
    initDateRange() {
        const range = dbManager.getDateRange();
        if (range) {
            document.getElementById('startDate').value = range.min;
            document.getElementById('endDate').value = range.max;
        }
    }
    
    renderDashboard() {
        this.renderThrottled();
    }
    
    _renderDashboard() {
        const start = document.getElementById('startDate')?.value;
        const end = document.getElementById('endDate')?.value;
        
        if (!validateDates(start, end)) {
            alert('请选择有效的日期范围');
            return;
        }
        
        const rows = dbManager.getActivityData(start, end);
        
        if (rows.length === 0) {
            alert('所选时间范围内没有数据');
            return;
        }
        
        // 使用 requestAnimationFrame 分批渲染
        requestAnimationFrame(() => {
            updateStats(rows);
            
            requestAnimationFrame(() => renderThemeDurationLine(rows));
            requestAnimationFrame(() => renderEfficiencyTrend(rows));
            requestAnimationFrame(() => renderThemePie(rows));
            requestAnimationFrame(() => renderEfficiencyBar(rows));
        });
    }
    
    resetChartSizes() {
        this.controls.resetToDefault();
        setTimeout(() => chartManager.resizeAll(), 100);
    }
}

// 创建全局应用实例
window.app = new App();

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
    window.app.init();
});
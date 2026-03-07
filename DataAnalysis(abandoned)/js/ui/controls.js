import { throttle } from '../utils/throttler.js';

export class ControlsManager {
    constructor(onSizeChange) {
        this.onSizeChange = onSizeChange;
        this.resizeTimers = {};
    }
    
    init() {
        this.initChartControls();
        this.initGlobalControls();
    }
    
    initChartControls() {
        document.querySelectorAll('[data-chart-id]').forEach(container => {
            const chartId = container.dataset.chartId;
            this.createControlsForChart(chartId, container);
        });
    }
    
    createControlsForChart(chartId, container) {
        const heightValue = document.getElementById(`height-${chartId}`)?.textContent || '280px';
        const widthValue = document.getElementById(`width-${chartId}`)?.textContent || '100%';
        
        container.innerHTML = `
            <div class="control-group">
                <label>📏 高 
                    <input type="range" class="chart-height" data-chart="${chartId}" 
                           min="180" max="400" value="280" step="10">
                </label>
                <span class="control-value" id="height-${chartId}">${heightValue}</span>
            </div>
            <div class="control-group">
                <label>📐 宽 
                    <input type="range" class="chart-width" data-chart="${chartId}" 
                           min="70" max="100" value="100" step="5">
                </label>
                <span class="control-value" id="width-${chartId}">${widthValue}</span>
            </div>
        `;
        
        this.bindChartControls(chartId);
    }
    
    bindChartControls(chartId) {
        const heightSlider = document.querySelector(`.chart-height[data-chart="${chartId}"]`);
        const widthSlider = document.querySelector(`.chart-width[data-chart="${chartId}"]`);
        
        if (heightSlider) {
            heightSlider.addEventListener('input', throttle((e) => {
                const height = e.target.value;
                document.getElementById(`height-${chartId}`).textContent = height + 'px';
                this.onSizeChange?.(chartId, 'height', height);
            }));
        }
        
        if (widthSlider) {
            widthSlider.addEventListener('input', throttle((e) => {
                const width = e.target.value;
                document.getElementById(`width-${chartId}`).textContent = width + '%';
                this.onSizeChange?.(chartId, 'width', width);
            }));
        }
    }
    
    initGlobalControls() {
        const globalHeight = document.getElementById('globalHeight');
        const globalWidth = document.getElementById('globalWidth');
        
        if (globalHeight) {
            globalHeight.addEventListener('input', throttle((e) => {
                const height = e.target.value;
                document.getElementById('globalHeightValue').textContent = height + 'px';
                this.setAllHeights(height);
            }));
        }
        
        if (globalWidth) {
            globalWidth.addEventListener('input', throttle((e) => {
                const width = e.target.value;
                document.getElementById('globalWidthValue').textContent = width + '%';
                this.setAllWidths(width);
            }));
        }
    }
    
    setAllHeights(height) {
        document.querySelectorAll('.chart-height').forEach(slider => {
            slider.value = height;
            const chartId = slider.dataset.chart;
            document.getElementById(`height-${chartId}`).textContent = height + 'px';
            this.onSizeChange?.(chartId, 'height', height);
        });
    }
    
    setAllWidths(width) {
        document.querySelectorAll('.chart-width').forEach(slider => {
            slider.value = width;
            const chartId = slider.dataset.chart;
            document.getElementById(`width-${chartId}`).textContent = width + '%';
            this.onSizeChange?.(chartId, 'width', width);
        });
    }
    
    resetToDefault() {
        document.getElementById('globalHeight').value = 280;
        document.getElementById('globalHeightValue').textContent = '280px';
        document.getElementById('globalWidth').value = 100;
        document.getElementById('globalWidthValue').textContent = '100%';
        
        this.setAllHeights(280);
        this.setAllWidths(100);
    }
}
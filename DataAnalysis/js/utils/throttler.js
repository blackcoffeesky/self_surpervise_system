// 节流函数
export function throttle(callback, delay = 16) {
    let timeoutId;
    return function(...args) {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            callback.apply(this, args);
        }, delay);
    };
}

// 防抖函数
export function debounce(callback, delay = 150) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            callback.apply(this, args);
        }, delay);
    };
}

// 渲染节流
export function renderThrottle(callback, minInterval = 300) {
    let lastRun = 0;
    let timeoutId;
    
    return function(...args) {
        const now = Date.now();
        
        if (now - lastRun >= minInterval) {
            lastRun = now;
            callback.apply(this, args);
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                lastRun = Date.now();
                callback.apply(this, args);
            }, minInterval - (now - lastRun));
        }
    };
}
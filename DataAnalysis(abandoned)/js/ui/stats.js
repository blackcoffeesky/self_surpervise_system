export function updateStats(rows) {
    const dates = rows.map(r => new Date(r.start));
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));
    
    const totalDays = Math.floor((maxDate - minDate) / (1000 * 60 * 60 * 24)) + 1;
    
    const totalDuration = rows.reduce((sum, r) => {
        return sum + (new Date(r.end) - new Date(r.start)) / 60000;
    }, 0);
    
    const avgPerDay = totalDuration / totalDays;
    
    document.getElementById('startDateInfo').innerText = 
        `📅 记录开始日期: ${minDate.toISOString().slice(0,10)}`;
    
    document.getElementById('totalDaysInfo').innerText = 
        `📊 记录总天数: ${totalDays}`;
    
    document.getElementById('totalRecordsInfo').innerText = 
        `📝 记录条数: ${rows.length}`;
    
    document.getElementById('totalDurationInfo').innerText = 
        `⏱️ 累计总分钟: ${totalDuration.toFixed(1)}`;
    
    document.getElementById('avgPerDayInfo').innerText = 
        `📈 平均每日分钟: ${avgPerDay.toFixed(1)}`;
}
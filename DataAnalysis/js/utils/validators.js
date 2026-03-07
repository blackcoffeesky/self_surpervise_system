// 验证数据库
// export function validateDatabase(db) {
//     try {
//         const tables = db.exec(`
//             SELECT name FROM sqlite_master 
//             WHERE type='table' AND name IN ('Activity', 'SubTheme')
//         `);
        
//         return tables.length >= 2;
//     } catch (error) {
//         console.error('数据库验证失败:', error);
//         return false;
//     }
// }

// 验证日期范围
export function validateDates(start, end) {
    if (!start || !end) return false;
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    return startDate <= endDate;
}

// 处理错误
export function handleError(error, message = '操作失败') {
    console.error(`${message}:`, error);
    alert(`${message}：${error.message}`);
}
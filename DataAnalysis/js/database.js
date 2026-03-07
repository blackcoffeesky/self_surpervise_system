import { handleError } from './utils/validators.js';

class DatabaseManager {
    constructor() {
        this.db = null;
        this.SQL = null;
    }
    
    async init() {
        try {
            this.SQL = await initSqlJs({
                locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
            });
            return true;
        } catch (error) {
            handleError(error, '初始化SQL.js失败');
            return false;
        }
    }
    
    async loadFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = () => {
                try {
                    const uInt8Array = new Uint8Array(reader.result);
                    this.db = new this.SQL.Database(uInt8Array);
                    
                    // if (!validateDatabase(this.db)) {
                    //     reject(new Error('数据库格式不正确，需要包含Activity和SubTheme表'));
                    //     return;
                    // }
                    
                    resolve(true);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(reader.error);
            reader.readAsArrayBuffer(file);
        });
    }
    
    query(sql, params = []) {
        if (!this.db) return null;
        
        try {
            const result = this.db.exec(sql, params);
            return result.length > 0 ? result[0].values : [];
        } catch (error) {
            handleError(error, '查询失败');
            return null;
        }
    }
    
    getDateRange() {
        const result = this.query(`
            SELECT MIN(start_time), MAX(start_time)
            FROM Activity
        `);
        
        if (!result || result.length === 0 || !result[0][0]) {
            return null;
        }
        
        return {
            min: result[0][0].slice(0, 10),
            max: result[0][1].slice(0, 10)
        };
    }
    
    getActivityData(start, end) {
        const result = this.query(`
            SELECT 
                A.start_time,
                A.end_time,
                A.efficiency,
                S.name
            FROM Activity A
            JOIN SubTheme S ON A.theme_id = S.id
            WHERE date(A.start_time) BETWEEN '${start}' AND '${end}'
            ORDER BY A.start_time
        `);
        
        if (!result) return [];
        
        return result.map(r => ({
            start: r[0],
            end: r[1],
            efficiency: r[2],
            theme: r[3]
        }));
    }
}

export const dbManager = new DatabaseManager();
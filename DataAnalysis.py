import sqlite3
import re
from datetime import datetime
import json

DB_PATH = "database.db"

# -------------------------
# 数据库连接
# -------------------------
def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn


# -------------------------
# 获取子主题ID
# -------------------------
def get_subtheme_id(conn, name):
    cur = conn.cursor()
    cur.execute("SELECT id FROM SubTheme WHERE name = ?", (name,))
    row = cur.fetchone()
    if row is None:
        raise ValueError(f"子主题不存在: {name}")
    return row[0]


# -------------------------
# 解析时间字符串
# -------------------------
def parse_time(timestr):
    try:
        return datetime.strptime(timestr, "%Y-%m-%d %H:%M")
    except ValueError:
        raise ValueError(f"时间格式错误: {timestr}")


def parse_and_insert_json(filepath):
    conn = get_connection()
    cur = conn.cursor()

    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)

    records = data["records"]

    for r in records:
        theme_name = r["theme"]
        start_str = r["startTime"]
        end_str = r["endTime"]
        efficiency = float(r.get("efficiency", 0.5))

        if not (0 <= efficiency <= 1):
            raise ValueError("效率必须在0~1之间")

        start_dt = parse_time(start_str)
        end_dt = parse_time(end_str)

        if end_dt < start_dt:
            raise ValueError("结束时间必须晚于开始时间")

        sub_id = get_subtheme_id(conn, theme_name)

        cur.execute("""
            INSERT INTO Activity (theme_id, start_time, end_time, efficiency)
            VALUES (?, ?, ?, ?)
        """, (
            sub_id,
            start_dt.strftime("%Y-%m-%d %H:%M"),
            end_dt.strftime("%Y-%m-%d %H:%M"),
            efficiency
        ))

    conn.commit()
    conn.close()

    print("JSON解析并插入完成")


# -------------------------
# 示例输入
# -------------------------
if __name__ == "__main__":
    jfile = "D:\\desktop\\workspace\\self_surpervise_system\\activity_export.json"

    parse_and_insert_json(jfile)
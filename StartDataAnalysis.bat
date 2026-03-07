@echo off
echo 启动本地服务器...
cd DataAnalysis
echo 打开浏览器访问 http://localhost:8000
python -m http.server 8000

pause
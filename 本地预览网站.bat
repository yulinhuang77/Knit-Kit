@echo off
setlocal
cd /d "%~dp0"
set "PATH=D:\开发工具\nodejs;%PATH%"
call npm.cmd run preview -- --host 0.0.0.0 --port 4173

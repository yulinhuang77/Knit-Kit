@echo off
setlocal
cd /d "%~dp0"
set "PATH=D:\开发工具\nodejs;%PATH%"
call npm.cmd run build
if errorlevel 1 exit /b 1
powershell -NoProfile -Command "Compress-Archive -Path '.\dist\*' -DestinationPath '.\纱线小喵-Knit-Kit网站发布包.zip' -Force"
echo.
echo 已生成：%~dp0纱线小喵-Knit-Kit网站发布包.zip
pause

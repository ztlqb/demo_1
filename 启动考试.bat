@echo off
chcp 65001 >nul
title 模拟考试

where node >nul 2>nul
if %errorlevel% neq 0 (
    set "PATH=%PATH%;C:\Program Files\nodejs"
)

if not exist "模拟考试.html" (
    echo  正在构建项目，请稍候...
    call npm run build
    copy /Y "dist\index.html" "模拟考试.html" >nul
    echo.
)

echo  正在打开模拟考试...
start "" "模拟考试.html"

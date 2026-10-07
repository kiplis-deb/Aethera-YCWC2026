@echo off
cd /d "%~dp0"
title Aethera AI Server

echo ===================================================
echo   Starting Aethera AI Server...
echo ===================================================

:: Ensure nodejs directory is in PATH for this session
if exist "C:\Users\gepee\nodejs" (
    set "PATH=C:\Users\gepee\nodejs;%PATH%"
)

:: Locate node executable
set "NODE_BIN=node"
if exist "C:\Users\gepee\nodejs\node.exe" (
    set "NODE_BIN=C:\Users\gepee\nodejs\node.exe"
)

:: Verify node is executable
"%NODE_BIN%" -v >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js was not found!
    echo Please ensure Node.js is installed.
    echo Expected path: C:\Users\gepee\nodejs\node.exe
    pause
    exit /b 1
)

echo [Server] Using Node:
"%NODE_BIN%" -v

:: Launch the server
"%NODE_BIN%" Backend\server.js

if %ERRORLEVEL% neq 0 (
    echo.
    echo [Server] Process ended with code %ERRORLEVEL%.
)

pause

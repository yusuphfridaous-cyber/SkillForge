@echo off
cd /d "%~dp0"

set "WORKSPACE_PATH=%~dp0"
set "WORKSPACE_PATH=%WORKSPACE_PATH:\=/%"
set "WORKSPACE_PATH=%WORKSPACE_PATH: =+%"
set "APP_URL=http://localhost:8000/?workspace=%WORKSPACE_PATH%"

where python >nul 2>nul
if errorlevel 1 (
    echo Python is required to run this app.
    echo Please install Python and try again.
    pause
    exit /b 1
)

start "HTML Progress Server" cmd /c "python -m http.server 8000"

timeout /t 1 >nul

if exist "%ProgramFiles%\Microsoft VS Code\Code.exe" (
    start "Open in VS Code" "%ProgramFiles%\Microsoft VS Code\Code.exe" "%~dp0"
) else if exist "%LocalAppData%\Programs\Microsoft VS Code\Code.exe" (
    start "Open in VS Code" "%LocalAppData%\Programs\Microsoft VS Code\Code.exe" "%~dp0"
) else (
    where code >nul 2>nul
    if not errorlevel 1 start "Open in VS Code" code "%~dp0"
)

timeout /t 2 >nul

where msedge >nul 2>nul
if not errorlevel 1 (
    start "HTML Progress" msedge --new-window --app="%APP_URL%"
    exit /b 0
)

where chrome >nul 2>nul
if not errorlevel 1 (
    start "HTML Progress" chrome --new-window --app="%APP_URL%"
    exit /b 0
)

start "HTML Progress" "%APP_URL%"

@echo off
echo ========================================================
echo Launching PhishGuard - All 3 Services
echo ========================================================
start "PhishGuard - ML Service (5001)" cmd /k "start_ml.bat"
timeout /t 3 /nobreak >nul
start "PhishGuard - Express Backend (5000)" cmd /k "start_server.bat"
timeout /t 3 /nobreak >nul
start "PhishGuard - React Frontend (3000)" cmd /k "start_client.bat"
echo All services launched in separate windows.

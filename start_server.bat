@echo off
echo ========================================================
echo Starting PhishGuard - Node.js Express Backend (Port 5000)
echo ========================================================
cd server
if not exist "node_modules\" (
    echo [INFO] Installing server npm packages...
    npm install
)
node index.js
pause

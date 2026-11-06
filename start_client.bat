@echo off
echo ========================================================
echo Starting PhishGuard - React Frontend (Port 3000)
echo ========================================================
cd client
if not exist "node_modules\" (
    echo [INFO] Installing client npm packages...
    npm install
)
npm start
pause

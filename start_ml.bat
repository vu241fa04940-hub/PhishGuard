@echo off
echo ========================================================
echo Starting PhishGuard - Python ML Service (Port 5001)
echo ========================================================
cd ml-service
if not exist "model\phishing_model.pkl" (
    echo [INFO] Training model first...
    python train_model.py
)
python app.py
pause

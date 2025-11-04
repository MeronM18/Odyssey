@echo off
echo Starting Odyessia...
start cmd /k "cd Odyessia\backend && npm run dev"
timeout /t 2 /nobreak >nul
start cmd /k "cd Odyessia\frontend && npx serve -l 3000"
timeout /t 3 /nobreak >nul
start http://localhost:3000/html/
echo Odyessia is running!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000/html/


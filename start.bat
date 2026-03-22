@echo off
echo Arrêt des anciens processus...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo Démarrage du backend...
start cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
echo Démarrage du frontend...
start cmd /k "npm run dev"
echo ✅ MoneyFlow démarré !

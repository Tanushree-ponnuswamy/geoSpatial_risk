@echo off
echo ===================================================
echo   🌿 NILGIRIS GEO-SPATIAL SYSTEM - ONE-CLICK RUN
echo ===================================================
echo.

echo [1/3] installing Web Dependencies...
cd web
call npm install
cd ..

echo [2/3] Installing Admin Dependencies...
cd admin
call npm install
cd ..

echo [3/3] Starting Servers...
echo.
echo   - Web Portal: http://localhost:3000
echo   - Admin Portal: http://localhost:3001
echo.
echo   (Press Ctrl+C to stop)
echo.

start "Nilgiris WEB Portal" cmd /k "cd web && npm run dev"
start "Nilgiris ADMIN Portal" cmd /k "cd admin && npm run dev -- -p 3001"

echo Servers started in background windows!
pause

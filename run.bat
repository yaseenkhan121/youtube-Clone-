@echo off
echo Starting WowTube servers...

:: Launch Laravel Backend Server
start "WowTube Backend (Laravel)" /D backend php artisan serve

:: Launch React Frontend Dev Server
start "WowTube Frontend (Vite)" /D frontend npm run dev

:: Wait for dev servers to initialize
ping 127.0.0.1 -n 4 >nul

:: Open browser at the single link
start http://localhost:5173

echo WowTube is running!
echo Access the unified link: http://localhost:5173
echo.
echo (Keep the separate server console windows open to keep running the application)
pause

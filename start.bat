@echo off
set "PROJECT_ROOT=%~dp0"

start "AI Service" cmd /k "cd /d "%PROJECT_ROOT%ai_service" && call venv\Scripts\activate.bat && python app.py"
start "Spring Boot Backend" cmd /k "cd /d "%PROJECT_ROOT%backend" && mvn spring-boot:run"
start "React Frontend" cmd /k "cd /d "%PROJECT_ROOT%frontend" && npm run dev"
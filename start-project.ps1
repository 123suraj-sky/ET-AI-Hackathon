# Get the project root (where this script is located)
$projectRoot = $PSScriptRoot

# AI Service
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    @"
`$Host.UI.RawUI.WindowTitle = 'AI Service'
Set-Location '$projectRoot\ai_service'
& .\venv\Scripts\activate
python app.py
"@
)

# Backend
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    @"
`$Host.UI.RawUI.WindowTitle = 'Spring Boot Backend'
Set-Location '$projectRoot\backend'
mvn spring-boot:run
"@
)

# Frontend
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    @"
`$Host.UI.RawUI.WindowTitle = 'React Frontend'
Set-Location '$projectRoot\frontend'
npm run dev
"@
)
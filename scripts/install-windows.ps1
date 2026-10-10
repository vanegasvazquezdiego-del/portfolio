# Creates a Windows desktop shortcut opening the portfolio in an app window.
# Usage: powershell -ExecutionPolicy Bypass -File scripts\install-windows.ps1 -Url "https://you.github.io/portfolio/"
param([string]$Url = "http://localhost:4173/")

$chromePaths = @(
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe"
)
$browser = $chromePaths | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $browser) { Write-Error "Chrome/Edge not found. Install Chrome or Edge first."; exit 1 }

$shell = New-Object -ComObject WScript.Shell
$lnk = $shell.CreateShortcut("$([Environment]::GetFolderPath('Desktop'))\AlexDev Portfolio.lnk")
$lnk.TargetPath = $browser
$lnk.Arguments = "--app=$Url"
$lnk.WorkingDirectory = Split-Path $browser
$lnk.Description = "AlexDev Portfolio"
$lnk.Save()
Write-Host "Desktop shortcut created → $Url (via $browser)"

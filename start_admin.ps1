#!/usr/bin/env powershell
# Quick Setup & Launch Script for Trading Admin Panel

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  Trading Admin Panel Setup" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan

# Get computer IP
$ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notmatch "Loopback"} | Select-Object -First 1).IPAddress
$local_ip = "localhost"

Write-Host "`n🔐 HTTPS Enabled - All connections are encrypted`n" -ForegroundColor Green

Write-Host "📱 Access Your Admin Panel From:" -ForegroundColor Yellow
Write-Host "  ✓ This Computer: https://$local_ip`:5000" -ForegroundColor Cyan
Write-Host "  ✓ Other Devices: https://$ip`:5000" -ForegroundColor Cyan

Write-Host "`n🔑 Admin Login Details:" -ForegroundColor Yellow
Write-Host "  Email: ebiyorzikorebai247@gmail.com" -ForegroundColor Cyan
Write-Host "  Password: zikorebai" -ForegroundColor Cyan

Write-Host "`n⚠️  First Visit Notice:" -ForegroundColor Magenta
Write-Host "  - You'll see a security warning about the certificate" -ForegroundColor White
Write-Host "  - This is normal for self-signed certificates" -ForegroundColor White
Write-Host "  - Click 'Advanced' → 'Proceed Anyway'" -ForegroundColor White

Write-Host "`n✨ Starting Flask Server..." -ForegroundColor Green

Set-Location "c:/Users/Hp/OneDrive/Desktop/code"
& "c:/Users/Hp/OneDrive/Desktop/code/.venv/Scripts/python.exe" app.py

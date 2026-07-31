# Готовит кадры портрета из исходника с большими полями.
#
# ГЛАВНОЕ ПРАВИЛО: есть охранная зона — область, которая не должна обрезаться
# ни на одном разрешении. Марк обвёл её на исходнике: голова с запасом сверху
# и обе руки целиком до нижнего края кадра.
#
# В исходнике 5504x3072 это x 1270..4140, y 430..3072 — пропорция ~1.087
# (чуть шире квадрата). Оба файла режутся ровно по ней и отличаются только размером
# в пикселях: крупный под десктоп, мелкий под телефон.
#
#   · doctor-portrait.jpg     — 1600 px по ширине, десктоп
#   · doctor-portrait-sm.jpg  —  900 px по ширине, телефон
#
# На сайте кадр вписывается ЦЕЛИКОМ (object-fit: contain), а не заполняет область.
# Поэтому обрезка физически невозможна: свободное место закрывается фоном того же
# цвета, что и фон снимка (#F1E2DA — замерен по исходнику, он ровный по всему кадру,
# разброс ±2 единицы). Стыка не видно.
#
# Запуск:  powershell -File tools/crop-portrait.ps1

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent (Split-Path -Parent $PSCommandPath)
$srcPath = Join-Path (Split-Path -Parent $root) 'assets-temp\doctor-portrait-color-original.jpg'
$outDir = Join-Path $root 'public\media'

$img = [System.Drawing.Image]::FromFile($srcPath)
Write-Output "исходник: $($img.Width)x$($img.Height)"

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$prm = New-Object System.Drawing.Imaging.EncoderParameters(1)
$prm.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 86)

# --- Охранная зона ---
$safeX = 1270
$safeY = 430
$safeW = 4140 - $safeX
$safeH = 3072 - $safeY
Write-Output ("охранная зона: {0},{1}  {2}x{3}  пропорция {4:N4}" -f $safeX, $safeY, $safeW, $safeH, ($safeW / $safeH))

function Save-Crop($outW, $name) {
  $outH = [int]([math]::Round($script:safeH * ($outW / $script:safeW)))
  $bmp = New-Object System.Drawing.Bitmap($outW, $outH)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $dst = New-Object System.Drawing.Rectangle(0, 0, $outW, $outH)
  $src = New-Object System.Drawing.Rectangle($script:safeX, $script:safeY, $script:safeW, $script:safeH)
  $g.DrawImage($script:img, $dst, $src, [System.Drawing.GraphicsUnit]::Pixel)
  $path = Join-Path $script:outDir $name
  $bmp.Save($path, $script:codec, $script:prm)
  $g.Dispose(); $bmp.Dispose()
  Write-Output "$name : ${outW}x${outH}, $([math]::Round((Get-Item $path).Length/1KB,0)) КБ"
}

Save-Crop -outW 1600 -name 'doctor-portrait.jpg'
Save-Crop -outW 900 -name 'doctor-portrait-sm.jpg'

$img.Dispose()

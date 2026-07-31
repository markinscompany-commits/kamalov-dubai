# Готовит два кадра портрета из исходника с большими полями.
#
# Исходник снят с умышленным запасом сверху и справа, чтобы кадрировать можно было
# под разные пропорции. Здесь этот запас срезается:
#   · doctor-portrait.jpg      — вертикальный кадр под правую половину десктопа
#   · doctor-portrait-wide.jpg — горизонтальный кадр под полосу сверху на телефоне
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

function Save-Crop($srcX, $srcY, $srcW, $srcH, $outW, $name) {
  $outH = [int]([math]::Round($srcH * ($outW / $srcW)))
  $bmp = New-Object System.Drawing.Bitmap($outW, $outH)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $dst = New-Object System.Drawing.Rectangle(0, 0, $outW, $outH)
  $src = New-Object System.Drawing.Rectangle($srcX, $srcY, $srcW, $srcH)
  $g.DrawImage($script:img, $dst, $src, [System.Drawing.GraphicsUnit]::Pixel)
  $path = Join-Path $script:outDir $name
  $bmp.Save($path, $script:codec, $script:prm)
  $g.Dispose(); $bmp.Dispose()
  Write-Output "$name : ${outW}x${outH}, $([math]::Round((Get-Item $path).Length/1KB,0)) КБ"
}

# Исходник 5504x3072, врач по центру. Голова начинается примерно на 22% высоты,
# руки уходят под нижний край — поэтому снизу берём всё до края, а запас режем сверху.

# Вертикальный (~0.82) — под правую половину десктопа
Save-Crop -srcX 1568 -srcY 250 -srcW 2314 -srcH 2822 -outW 1400 -name 'doctor-portrait.jpg'

# Почти квадратный (~1.0) — под полосу сверху на телефоне: при нынешней высоте полосы
# она получается почти квадратной, и горизонтальный кадр обрезался бы по бокам
Save-Crop -srcX 1339 -srcY 300 -srcW 2772 -srcH 2772 -outW 1200 -name 'doctor-portrait-wide.jpg'

$img.Dispose()

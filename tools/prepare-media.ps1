# Готовит картинку для сайта: уменьшает до нужной ширины и пережимает.
#
# Обработка запекается в файл, а не вешается фильтром в CSS — телефон иначе
# пересчитывает её при каждой отрисовке (было среди причин подёргивания).
#
# Запуск:
#   powershell -File tools/prepare-media.ps1 -Src ..\assets-temp\archive-father-1.jpg `
#     -Out archive-father.jpg -Width 1000
#
# Пути: -Src от папки site, -Out кладётся в public/media.

# Можно вырезать часть кадра: доли от исходника, 0..1.
#   -CropX 0.3 -CropY 0 -CropW 0.45 -CropH 0.55
param(
  [Parameter(Mandatory = $true)][string]$Src,
  [Parameter(Mandatory = $true)][string]$Out,
  [int]$Width = 1200,
  [int]$Quality = 82,
  [double]$CropX = 0,
  [double]$CropY = 0,
  [double]$CropW = 1,
  [double]$CropH = 1
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent (Split-Path -Parent $PSCommandPath)
$srcPath = if ([System.IO.Path]::IsPathRooted($Src)) { $Src } else { Join-Path $root $Src }
$outPath = Join-Path $root (Join-Path 'public\media' $Out)

$img = [System.Drawing.Image]::FromFile($srcPath)
Write-Output "исходник: $($img.Width)x$($img.Height)"

# Область исходника, которую берём
$sx = [int][Math]::Round($img.Width * $CropX)
$sy = [int][Math]::Round($img.Height * $CropY)
$sw = [int][Math]::Round($img.Width * $CropW)
$sh = [int][Math]::Round($img.Height * $CropH)
Write-Output "кадр: $sx,$sy $sw x $sh"

$h = [int][Math]::Round($sh * ($Width / $sw))
$bmp = New-Object System.Drawing.Bitmap($Width, $h)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.DrawImage(
  $img,
  (New-Object System.Drawing.Rectangle(0, 0, $Width, $h)),
  (New-Object System.Drawing.Rectangle($sx, $sy, $sw, $sh)),
  [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$params = New-Object System.Drawing.Imaging.EncoderParameters(1)
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
  [System.Drawing.Imaging.Encoder]::Quality, [int]$Quality)

$bmp.Save($outPath, $codec, $params)
Write-Output "готово: $outPath ($Width x $h)"

$bmp.Dispose()
$img.Dispose()

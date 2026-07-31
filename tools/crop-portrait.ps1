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

# --- Обработка запекается в файл, а не вешается фильтром в CSS ---
#
# Раньше в вёрстке стоял filter: saturate(0.92) contrast(1.02). Два минуса:
#   · телефон пересчитывает фильтр при отрисовке — лишняя работа на прокрутке;
#   · фильтр сдвигает цвет, и фон вокруг кадра приходилось подбирать под сдвинутый.
# Теперь то же самое считается один раз здесь.
#
# Насыщенность 0.92 по стандартным весам яркости, затем контраст 1.02
# (out = in * 1.02 - 0.01). Порядок тот же, что был в CSS.

$sat = 0.92
$k = 1.02
$off = -0.01

$m00 = (0.213 + 0.787 * $sat) * $k
$m10 = (0.715 - 0.715 * $sat) * $k
$m20 = (0.072 - 0.072 * $sat) * $k
$m01 = (0.213 - 0.213 * $sat) * $k
$m11 = (0.715 + 0.285 * $sat) * $k
$m21 = (0.072 - 0.072 * $sat) * $k
$m02 = (0.213 - 0.213 * $sat) * $k
$m12 = (0.715 - 0.715 * $sat) * $k
$m22 = (0.072 + 0.928 * $sat) * $k

$matrix = New-Object System.Drawing.Imaging.ColorMatrix
$matrix.Matrix00 = $m00; $matrix.Matrix01 = $m01; $matrix.Matrix02 = $m02
$matrix.Matrix10 = $m10; $matrix.Matrix11 = $m11; $matrix.Matrix12 = $m12
$matrix.Matrix20 = $m20; $matrix.Matrix21 = $m21; $matrix.Matrix22 = $m22
$matrix.Matrix33 = 1
$matrix.Matrix40 = $off; $matrix.Matrix41 = $off; $matrix.Matrix42 = $off
$matrix.Matrix44 = 1

function Save-Crop($outW, $name) {
  $outH = [int]([math]::Round($script:safeH * ($outW / $script:safeW)))
  $bmp = New-Object System.Drawing.Bitmap($outW, $outH)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

  $attr = New-Object System.Drawing.Imaging.ImageAttributes
  $attr.SetColorMatrix($script:matrix)

  $dst = New-Object System.Drawing.Rectangle(0, 0, $outW, $outH)
  $g.DrawImage(
    $script:img, $dst,
    $script:safeX, $script:safeY, $script:safeW, $script:safeH,
    [System.Drawing.GraphicsUnit]::Pixel, $attr
  )
  $path = Join-Path $script:outDir $name
  $bmp.Save($path, $script:codec, $script:prm)
  $attr.Dispose(); $g.Dispose()

  # Цвет фона готового кадра — им красится область вокруг снимка на странице.
  # Печатаем сразу: значение идёт в токен --photo-bg.
  $probe = $bmp.GetPixel([int]($outW * 0.06), [int]($outH * 0.06))
  $kb = [math]::Round((Get-Item $path).Length / 1KB, 0)
  $hex = '{0:X2}{1:X2}{2:X2}' -f $probe.R, $probe.G, $probe.B
  Write-Output "$name : ${outW}x${outH}, $kb KB, photo-bg #$hex"
  $bmp.Dispose()
}

Save-Crop -outW 1600 -name 'doctor-portrait.jpg'
Save-Crop -outW 900 -name 'doctor-portrait-sm.jpg'

$img.Dispose()

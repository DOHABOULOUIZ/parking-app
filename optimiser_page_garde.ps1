# Script pour recadrer et optimiser p_gard_cover.png
# Supprime les espaces blancs autour du contenu
# Créé le 18/04/2026

Add-Type -AssemblyName System.Drawing

$inputImage = Join-Path $PSScriptRoot "p_gard_cover.png"
$outputImage = Join-Path $PSScriptRoot "p_gard_cover_optimized.png"
$backupImage = Join-Path $PSScriptRoot "p_gard_cover_original_backup.png"

Write-Host "=== Optimisation de la page de garde ===" -ForegroundColor Cyan

if (-not (Test-Path $inputImage)) {
    Write-Host "ERREUR: $inputImage introuvable!" -ForegroundColor Red
    exit 1
}

try {
    # Créer une sauvegarde
    if (-not (Test-Path $backupImage)) {
        Copy-Item $inputImage $backupImage
        Write-Host "Sauvegarde creee: $backupImage" -ForegroundColor Green
    }
    
    # Charger l'image
    Write-Host "Chargement de l'image..." -ForegroundColor Yellow
    $bitmap = [System.Drawing.Bitmap]::FromFile($inputImage)
    
    $width = $bitmap.Width
    $height = $bitmap.Height
    
    Write-Host "Dimensions originales: ${width}x${height} pixels" -ForegroundColor Gray
    
    # Trouver les limites du contenu (zones non blanches)
    Write-Host "Analyse des zones blanches..." -ForegroundColor Yellow
    
    $minX = $width
    $minY = $height
    $maxX = 0
    $maxY = 0
    
    $whiteThreshold = 250  # Valeur RGB au-dessus de laquelle on considère blanc
    
    for ($y = 0; $y -lt $height; $y++) {
        for ($x = 0; $x -lt $width; $x++) {
            $pixel = $bitmap.GetPixel($x, $y)
            
            # Si le pixel n'est pas blanc (contenu réel)
            if ($pixel.R -lt $whiteThreshold -or $pixel.G -lt $whiteThreshold -or $pixel.B -lt $whiteThreshold) {
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }
    
    # Ajouter une petite marge (2% de chaque côté)
    $marginPercent = 0.02
    $marginX = [Math]::Floor($width * $marginPercent)
    $marginY = [Math]::Floor($height * $marginPercent)
    
    $minX = [Math]::Max(0, $minX - $marginX)
    $minY = [Math]::Max(0, $minY - $marginY)
    $maxX = [Math]::Min($width - 1, $maxX + $marginX)
    $maxY = [Math]::Min($height - 1, $maxY + $marginY)
    
    $cropWidth = $maxX - $minX + 1
    $cropHeight = $maxY - $minY + 1
    
    Write-Host "Zone de contenu detectee: ${minX},${minY} -> ${maxX},${maxY}" -ForegroundColor Gray
    Write-Host "Nouvelles dimensions: ${cropWidth}x${cropHeight} pixels" -ForegroundColor Green
    
    # Créer l'image recadrée
    Write-Host "Recadrage de l'image..." -ForegroundColor Yellow
    
    $cropRect = New-Object System.Drawing.Rectangle($minX, $minY, $cropWidth, $cropHeight)
    $croppedBitmap = $bitmap.Clone($cropRect, $bitmap.PixelFormat)
    
    # Sauvegarder
    Write-Host "Sauvegarde de l'image optimisee..." -ForegroundColor Yellow
    $croppedBitmap.Save($outputImage, [System.Drawing.Imaging.ImageFormat]::Png)
    
    # Nettoyer
    $bitmap.Dispose()
    $croppedBitmap.Dispose()
    
    # Remplacer l'original par la version optimisée
    Write-Host "Remplacement de l'image originale..." -ForegroundColor Yellow
    Remove-Item $inputImage -Force
    Move-Item $outputImage $inputImage -Force
    
    Write-Host ""
    Write-Host "=== SUCCES ===" -ForegroundColor Green
    Write-Host "Image optimisee! Espaces blancs supprimes." -ForegroundColor Green
    Write-Host "Dimensions finales: ${cropWidth}x${cropHeight} pixels" -ForegroundColor Green
    Write-Host ""
    Write-Host "Maintenant, relancez: .\remplacer_page_garde_FULLSIZE.ps1" -ForegroundColor Yellow
    
} catch {
    Write-Host "ERREUR: $($_.Exception.Message)" -ForegroundColor Red
    if ($bitmap) { $bitmap.Dispose() }
    if ($croppedBitmap) { $croppedBitmap.Dispose() }
    exit 1
}

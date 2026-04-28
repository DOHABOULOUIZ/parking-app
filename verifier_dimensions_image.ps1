# Script pour vérifier les dimensions de l'image dans le document Word
# Créé le 19/04/2026

$docPath = Join-Path $PSScriptRoot "Rapport de Stage -f-.docx"

if (-not (Test-Path $docPath)) {
    Write-Host "ERREUR: Document introuvable!" -ForegroundColor Red
    exit 1
}

Write-Host "=== Verification des dimensions de la page de garde ===" -ForegroundColor Cyan

try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    
    Write-Host "Ouverture du document..." -ForegroundColor Yellow
    $doc = $word.Documents.Open($docPath)
    
    # Aller à la première page
    $word.Selection.HomeKey([Microsoft.Office.Interop.Word.WdUnits]::wdStory) | Out-Null
    
    # Vérifier s'il y a des images
    if ($doc.InlineShapes.Count -gt 0) {
        $image = $doc.InlineShapes.Item(1)
        
        $widthPoints = $image.Width
        $heightPoints = $image.Height
        
        # Convertir en mm (1 point = 0.352778 mm)
        $widthMm = [Math]::Round($widthPoints * 0.352778, 2)
        $heightMm = [Math]::Round($heightPoints * 0.352778, 2)
        
        Write-Host ""
        Write-Host "=== DIMENSIONS ACTUELLES DE L'IMAGE ===" -ForegroundColor Green
        Write-Host "Largeur:  $widthPoints points ($widthMm mm)" -ForegroundColor White
        Write-Host "Hauteur:  $heightPoints points ($heightMm mm)" -ForegroundColor White
        Write-Host ""
        Write-Host "=== PAGE A4 ===" -ForegroundColor Cyan
        Write-Host "Largeur:  595.28 points (210 mm)" -ForegroundColor White
        Write-Host "Hauteur:  841.89 points (297 mm)" -ForegroundColor White
        Write-Host ""
        
        # Calculer le pourcentage
        $percentWidth = [Math]::Round(($widthPoints / 595.28) * 100, 1)
        $percentHeight = [Math]::Round(($heightPoints / 841.89) * 100, 1)
        
        Write-Host "=== POURCENTAGE PAR RAPPORT A LA PAGE ===" -ForegroundColor Yellow
        Write-Host "Largeur:  $percentWidth%" -ForegroundColor White
        Write-Host "Hauteur:  $percentHeight%" -ForegroundColor White
        Write-Host ""
        
        # Vérifier le ratio d'aspect
        $ratio = [Math]::Round($widthPoints / $heightPoints, 3)
        Write-Host "Ratio d'aspect: $ratio (devrait etre 0.563 pour 1080x1920)" -ForegroundColor Gray
        
    } else {
        Write-Host "ATTENTION: Aucune image trouvee dans le document!" -ForegroundColor Yellow
    }
    
    $doc.Close($false)
    $word.Quit()
    
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($doc) | Out-Null
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
    
} catch {
    Write-Host "ERREUR: $($_.Exception.Message)" -ForegroundColor Red
    if ($doc) { $doc.Close($false) }
    if ($word) { $word.Quit() }
    exit 1
}

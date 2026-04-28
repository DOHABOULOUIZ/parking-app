# Script pour remplacer la première page du rapport Word par une image
# Créé le 18/04/2026

# Utiliser des chemins relatifs pour éviter les problèmes d'encodage
$docPath = Join-Path $PSScriptRoot "Rapport de Stage -f-.docx"
$imagePath = Join-Path $PSScriptRoot "p_gard_cover.png"

# Vérifier que les fichiers existent
if (-not (Test-Path $docPath)) {
    Write-Host "ERREUR: Document Word introuvable: $docPath" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $imagePath)) {
    Write-Host "ERREUR: Image introuvable: $imagePath" -ForegroundColor Red
    exit 1
}

Write-Host "=== Remplacement de la page de garde ===" -ForegroundColor Cyan
Write-Host "Document: $docPath" -ForegroundColor Yellow
Write-Host "Image: $imagePath" -ForegroundColor Yellow

# Créer une sauvegarde
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupPath = $docPath -replace '\.docx$', "_backup_pagegrade_$timestamp.docx"
Copy-Item -Path $docPath -Destination $backupPath -Force
Write-Host "Sauvegarde créée: $backupPath" -ForegroundColor Green

try {
    # Créer l'objet Word
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    
    Write-Host "Ouverture du document..." -ForegroundColor Yellow
    $doc = $word.Documents.Open($docPath)
    
    # Sélectionner la première page complète
    Write-Host "Sélection de la première page..." -ForegroundColor Yellow
    $word.Selection.GoTo([Microsoft.Office.Interop.Word.WdGoToItem]::wdGoToPage, 
                         [Microsoft.Office.Interop.Word.WdGoToDirection]::wdGoToAbsolute, 
                         1) | Out-Null
    
    # Sélectionner jusqu'à la fin de la première page
    $word.Selection.Bookmarks.Item("\page").Select()
    
    # Supprimer le contenu de la première page
    Write-Host "Suppression du contenu de la première page..." -ForegroundColor Yellow
    $word.Selection.Delete() | Out-Null
    
    # Repositionner au début du document
    $word.Selection.HomeKey([Microsoft.Office.Interop.Word.WdUnits]::wdStory) | Out-Null
    
    # Insérer l'image
    Write-Host "Insertion de la nouvelle page de garde..." -ForegroundColor Yellow
    $shape = $word.Selection.InlineShapes.AddPicture($imagePath, $false, $true)
    
    # Redimensionner l'image pour occuper toute la page A4
    # A4 en points: 595 x 842 points (210 x 297 mm)
    # Marges: laisser environ 0mm de marge pour une page de garde full
    $pageWidth = 595  # points
    $pageHeight = 842 # points
    
    $shape.LockAspectRatio = [Microsoft.Office.Core.MsoTriState]::msoFalse
    $shape.Width = $pageWidth
    $shape.Height = $pageHeight
    
    # Insérer un saut de page après l'image pour séparer de la page suivante
    $word.Selection.EndKey([Microsoft.Office.Interop.Word.WdUnits]::wdLine) | Out-Null
    $word.Selection.InsertBreak([Microsoft.Office.Interop.Word.WdBreakType]::wdPageBreak)
    
    Write-Host "Sauvegarde du document..." -ForegroundColor Yellow
    $doc.Save()
    
    Write-Host "Fermeture du document..." -ForegroundColor Yellow
    $doc.Close()
    $word.Quit()
    
    # Libérer les objets COM
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($doc) | Out-Null
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
    
    Write-Host ""
    Write-Host "=== SUCCÈS ===" -ForegroundColor Green
    Write-Host "La page de garde a été remplacée par l'image !" -ForegroundColor Green
    Write-Host "Les autres pages sont restées intactes." -ForegroundColor Green
    
} catch {
    Write-Host ""
    Write-Host "ERREUR lors du traitement:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    # Nettoyer en cas d'erreur
    if ($doc) { $doc.Close($false) }
    if ($word) { $word.Quit() }
    
    exit 1
}

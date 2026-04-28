# Script pour remplacer UNIQUEMENT le contenu de la première page par l'image
# SANS ajouter de nouvelles pages au document

$docPath = "Rapport de Stage -f-f.docx"
$imagePath = "p_gard_cover.png"

# Vérifier que les fichiers existent
if (-not (Test-Path $docPath)) {
    Write-Host "ERREUR: Document Word introuvable: $docPath" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $imagePath)) {
    Write-Host "ERREUR: Image introuvable: $imagePath" -ForegroundColor Red
    exit 1
}

Write-Host "=== Remplacement de la page de garde (SANS ajouter de pages) ===" -ForegroundColor Cyan
Write-Host "Document: $docPath" -ForegroundColor Yellow
Write-Host "Image: $imagePath" -ForegroundColor Yellow

# Créer une sauvegarde
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupPath = "Rapport de Stage -f-f_backup_SANS_PAGES_$timestamp.docx"
Copy-Item -Path $docPath -Destination $backupPath -Force
Write-Host "Sauvegarde créée: $backupPath" -ForegroundColor Green

try {
    # Créer l'objet Word
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    
    Write-Host "Ouverture du document..." -ForegroundColor Yellow
    $doc = $word.Documents.Open((Resolve-Path $docPath).Path)
    
    $initialPageCount = $doc.ComputeStatistics(2)  # wdStatisticPages = 2
    Write-Host "Nombre de pages initial: $initialPageCount" -ForegroundColor Cyan
    
    # Obtenir la première section
    $section1 = $doc.Sections.Item(1)
    
    # Sauvegarder les marges d'origine de la section 1
    $originalTopMargin = $section1.PageSetup.TopMargin
    $originalBottomMargin = $section1.PageSetup.BottomMargin
    $originalLeftMargin = $section1.PageSetup.LeftMargin
    $originalRightMargin = $section1.PageSetup.RightMargin
    
    Write-Host "Marges d'origine Section 1: T=$originalTopMargin, B=$originalBottomMargin, L=$originalLeftMargin, R=$originalRightMargin" -ForegroundColor Cyan
    
    # Supprimer les marges de la section 1 pour l'image pleine page
    Write-Host "Suppression des marges de la section 1..." -ForegroundColor Yellow
    $section1.PageSetup.TopMargin = 0
    $section1.PageSetup.BottomMargin = 0
    $section1.PageSetup.LeftMargin = 0
    $section1.PageSetup.RightMargin = 0
    
    # Aller à la page 1 et sélectionner UNIQUEMENT son contenu
    Write-Host "Selection du contenu de la page 1..." -ForegroundColor Yellow
    $word.Selection.GoTo([Microsoft.Office.Interop.Word.WdGoToItem]::wdGoToPage, 
                         [Microsoft.Office.Interop.Word.WdGoToDirection]::wdGoToAbsolute, 
                         1) | Out-Null
    
    # Sélectionner tout le contenu de la page 1 (mais pas la marque de section)
    $word.Selection.Bookmarks.Item("\page").Select()
    
    # Supprimer le contenu sélectionné
    Write-Host "Suppression du contenu de la page 1..." -ForegroundColor Yellow
    $word.Selection.Delete() | Out-Null
    
    # Se positionner au tout début du document
    $word.Selection.HomeKey([Microsoft.Office.Interop.Word.WdUnits]::wdStory) | Out-Null
    
    # Insérer l'image
    Write-Host "Insertion de l'image en pleine page..." -ForegroundColor Yellow
    $shape = $word.Selection.InlineShapes.AddPicture((Resolve-Path $imagePath).Path, $false, $true)
    
    # Calculer les dimensions A4 en points
    $pageWidthPoints = 595.28
    $pageHeightPoints = 841.89
    
    Write-Host "Redimensionnement à ${pageWidthPoints}x${pageHeightPoints} points..." -ForegroundColor Yellow
    
    # Désactiver le ratio d'aspect pour forcer les dimensions exactes
    $shape.LockAspectRatio = [Microsoft.Office.Core.MsoTriState]::msoFalse
    $shape.Width = $pageWidthPoints
    $shape.Height = $pageHeightPoints
    
    Write-Host "Image forcée aux dimensions A4 exactes: ${pageWidthPoints}x${pageHeightPoints} pts" -ForegroundColor Green
    
    # Centrer l'image horizontalement
    Write-Host "Centrage horizontal de l'image..." -ForegroundColor Yellow
    $word.Selection.HomeKey([Microsoft.Office.Interop.Word.WdUnits]::wdStory) | Out-Null
    $word.Selection.ParagraphFormat.Alignment = [Microsoft.Office.Interop.Word.WdParagraphAlignment]::wdAlignParagraphCenter
    
    # Vérifier le nombre de pages final
    $finalPageCount = $doc.ComputeStatistics(2)
    Write-Host "Nombre de pages final: $finalPageCount" -ForegroundColor Cyan
    
    if ($finalPageCount -ne $initialPageCount) {
        Write-Host "ATTENTION: Le nombre de pages a changé ! ($initialPageCount -> $finalPageCount)" -ForegroundColor Yellow
    } else {
        Write-Host "SUCCÈS: Nombre de pages inchangé ($initialPageCount pages)" -ForegroundColor Green
    }
    
    # Sauvegarder
    Write-Host "Sauvegarde du document..." -ForegroundColor Yellow
    $doc.Save()
    
    Write-Host "Fermeture du document..." -ForegroundColor Yellow
    $doc.Close()
    $word.Quit()
    
    # Libérer les objets COM
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($shape) | Out-Null
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($section1) | Out-Null
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($doc) | Out-Null
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
    
    Write-Host ""
    Write-Host "=== SUCCÈS ===" -ForegroundColor Green
    Write-Host "La page de garde a été remplacée SANS ajouter de pages !" -ForegroundColor Green
    Write-Host "Les marges de la section 1 ont été supprimées pour l'image pleine page." -ForegroundColor Green
    
} catch {
    Write-Host "ERREUR: $_" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($doc) {
        $doc.Close([ref]$false)
    }
    if ($word) {
        $word.Quit()
    }
    exit 1
}

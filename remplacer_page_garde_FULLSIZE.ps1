# Script pour remplacer la première page du rapport Word par une image PLEINE PAGE
# Créé le 18/04/2026

# Utiliser des chemins relatifs
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

Write-Host "=== Remplacement de la page de garde (PLEINE PAGE) ===" -ForegroundColor Cyan
Write-Host "Document: $docPath" -ForegroundColor Yellow
Write-Host "Image: $imagePath" -ForegroundColor Yellow

# Créer une sauvegarde
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupPath = $docPath -replace '\.docx$', "_backup_fullsize_$timestamp.docx"
Copy-Item -Path $docPath -Destination $backupPath -Force
Write-Host "Sauvegarde créée: $backupPath" -ForegroundColor Green

try {
    # Créer l'objet Word
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    
    Write-Host "Ouverture du document..." -ForegroundColor Yellow
    $doc = $word.Documents.Open($docPath)
    
    # Obtenir la première section pour modifier les marges
    $section = $doc.Sections.Item(1)
    
    # Sauvegarder les marges d'origine pour les restaurer après la première page
    $originalTopMargin = $section.PageSetup.TopMargin
    $originalBottomMargin = $section.PageSetup.BottomMargin
    $originalLeftMargin = $section.PageSetup.LeftMargin
    $originalRightMargin = $section.PageSetup.RightMargin
    
    Write-Host "Marges d'origine: T=$originalTopMargin, B=$originalBottomMargin, L=$originalLeftMargin, R=$originalRightMargin" -ForegroundColor Gray
    
    # Supprimer TOUTES les marges de la première section
    Write-Host "Suppression des marges de la première page..." -ForegroundColor Yellow
    $section.PageSetup.TopMargin = 0
    $section.PageSetup.BottomMargin = 0
    $section.PageSetup.LeftMargin = 0
    $section.PageSetup.RightMargin = 0
    
    # Aller au début du document
    $word.Selection.HomeKey([Microsoft.Office.Interop.Word.WdUnits]::wdStory) | Out-Null
    
    # Sélectionner et supprimer le contenu de la première page
    $word.Selection.GoTo([Microsoft.Office.Interop.Word.WdGoToItem]::wdGoToPage, 
                         [Microsoft.Office.Interop.Word.WdGoToDirection]::wdGoToAbsolute, 
                         1) | Out-Null
    $word.Selection.Bookmarks.Item("\page").Select()
    
    Write-Host "Suppression du contenu de la première page..." -ForegroundColor Yellow
    $word.Selection.Delete() | Out-Null
    
    # Repositionner au début
    $word.Selection.HomeKey([Microsoft.Office.Interop.Word.WdUnits]::wdStory) | Out-Null
    
    # Insérer l'image
    Write-Host "Insertion de l'image en pleine page..." -ForegroundColor Yellow
    $shape = $word.Selection.InlineShapes.AddPicture($imagePath, $false, $true)
    
    # Calculer les dimensions A4 en points (1 point = 1/72 inch, A4 = 210x297mm)
    # 210mm = 595.28 points, 297mm = 841.89 points
    $pageWidthPoints = 595.28
    $pageHeightPoints = 841.89
    
    Write-Host "Redimensionnement a ${pageWidthPoints}x${pageHeightPoints} points..." -ForegroundColor Yellow
    
    # DESACTIVER le ratio d'aspect pour forcer les dimensions EXACTES de la page A4
    # Cela déformera légèrement l'image mais remplira TOUTE la page sans marges
    $shape.LockAspectRatio = [Microsoft.Office.Core.MsoTriState]::msoFalse
    
    # Forcer les dimensions EXACTES de la page A4
    $shape.Width = $pageWidthPoints
    $shape.Height = $pageHeightPoints
    
    Write-Host "Image forcee aux dimensions A4 exactes: ${pageWidthPoints}x${pageHeightPoints} pts" -ForegroundColor Green
    
    # Centrer l'image horizontalement sur la page
    Write-Host "Centrage horizontal de l'image..." -ForegroundColor Yellow
    $word.Selection.HomeKey([Microsoft.Office.Interop.Word.WdUnits]::wdStory) | Out-Null
    $word.Selection.ParagraphFormat.Alignment = [Microsoft.Office.Interop.Word.WdParagraphAlignment]::wdAlignParagraphCenter
    
    # Aller à la fin de l'image
    $word.Selection.EndKey([Microsoft.Office.Interop.Word.WdUnits]::wdLine) | Out-Null
    
    # Vérifier le nombre de sections existantes
    $initialSectionCount = $doc.Sections.Count
    Write-Host "Nombre de sections existantes: $initialSectionCount" -ForegroundColor Cyan
    
    # Si le document n'a qu'une seule section, insérer un saut de section CONTINU
    # pour permettre des marges différentes sans créer de page blanche
    if ($initialSectionCount -eq 1) {
        Write-Host "Insertion d'un saut de section continu..." -ForegroundColor Yellow
        # Utiliser un saut continu au lieu de NextPage pour éviter la page blanche
        $word.Selection.InsertBreak([Microsoft.Office.Interop.Word.WdBreakType]::wdSectionBreakContinuous)
        
        # Puis insérer un saut de page simple pour passer à la page suivante
        $word.Selection.InsertBreak([Microsoft.Office.Interop.Word.WdBreakType]::wdPageBreak)
    } else {
        Write-Host "Sections multiples detectees - pas de modification" -ForegroundColor Yellow
    }
    
    # Restaurer les marges d'origine pour la deuxième section (reste du document)
    Write-Host "Restauration des marges pour les pages suivantes..." -ForegroundColor Yellow
    $section2 = $doc.Sections.Item(2)
    $section2.PageSetup.TopMargin = $originalTopMargin
    $section2.PageSetup.BottomMargin = $originalBottomMargin
    $section2.PageSetup.LeftMargin = $originalLeftMargin
    $section2.PageSetup.RightMargin = $originalRightMargin
    
    Write-Host "Sauvegarde du document..." -ForegroundColor Yellow
    $doc.Save()
    
    Write-Host "Fermeture du document..." -ForegroundColor Yellow
    $doc.Close()
    $word.Quit()
    
    # Libérer les objets COM
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($shape) | Out-Null
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($section) | Out-Null
    if ($section2) { [System.Runtime.Interopservices.Marshal]::ReleaseComObject($section2) | Out-Null }
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($doc) | Out-Null
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
    
    Write-Host ""
    Write-Host "=== SUCCÈS ===" -ForegroundColor Green
    Write-Host "La page de garde occupe maintenant TOUTE la première page !" -ForegroundColor Green
    Write-Host "Les autres pages ont conservé leurs marges normales." -ForegroundColor Green
    
} catch {
    Write-Host ""
    Write-Host "ERREUR lors du traitement:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    # Nettoyer en cas d'erreur
    if ($doc) { $doc.Close($false) }
    if ($word) { $word.Quit() }
    
    exit 1
}

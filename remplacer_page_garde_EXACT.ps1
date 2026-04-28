# Script ULTRA-PRECIS pour remplacer la page de garde sans ajouter de pages
# Objectif: 61 pages avant = 61 pages après

$docPath = "Rapport de Stage -f-f.docx"
$imagePath = "p_gard_cover.png"

if (-not (Test-Path $docPath)) {
    Write-Host "ERREUR: Document introuvable" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $imagePath)) {
    Write-Host "ERREUR: Image introuvable" -ForegroundColor Red
    exit 1
}

Write-Host "=== Remplacement PRECIS de la page de garde ===" -ForegroundColor Cyan

# Backup
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupPath = "Rapport de Stage -f-f_backup_FINAL_$timestamp.docx"
Copy-Item -Path $docPath -Destination $backupPath -Force
Write-Host "Backup: $backupPath" -ForegroundColor Green

try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    
    $doc = $word.Documents.Open((Resolve-Path $docPath).Path)
    
    $initialPageCount = $doc.ComputeStatistics(2)
    Write-Host "Pages initiales: $initialPageCount" -ForegroundColor Cyan
    Write-Host "Sections initiales: $($doc.Sections.Count)" -ForegroundColor Cyan
    
    # Section 1 - Supprimer les marges
    $section1 = $doc.Sections.Item(1)
    $section1.PageSetup.TopMargin = 0
    $section1.PageSetup.BottomMargin = 0
    $section1.PageSetup.LeftMargin = 0
    $section1.PageSetup.RightMargin = 0
    
    # Aller au tout début du document
    $word.Selection.HomeKey([Microsoft.Office.Interop.Word.WdUnits]::wdStory) | Out-Null
    
    # Sélectionner UNIQUEMENT le contenu jusqu'à la fin de la page 1
    # Utiliser wdGoToPage pour aller à la page 2
    $word.Selection.GoTo([Microsoft.Office.Interop.Word.WdGoToItem]::wdGoToPage, 
                         [Microsoft.Office.Interop.Word.WdGoToDirection]::wdGoToAbsolute, 
                         2) | Out-Null
    
    # Maintenant on est au début de la page 2
    # Sélectionner depuis le début du document jusqu'à la position actuelle (début page 2)
    $startOfPage2 = $word.Selection.Start
    
    # Retourner au début
    $word.Selection.HomeKey([Microsoft.Office.Interop.Word.WdUnits]::wdStory) | Out-Null
    
    # Sélectionner depuis le début jusqu'au début de la page 2
    $word.Selection.SetRange(0, $startOfPage2)
    
    Write-Host "Contenu page 1 selectionne ($startOfPage2 caracteres)" -ForegroundColor Yellow
    
    # Supprimer le contenu sélectionné
    $word.Selection.Delete() | Out-Null
    Write-Host "Contenu page 1 supprime" -ForegroundColor Yellow
    
    # On est maintenant au début du document (vide)
    # Insérer l'image
    $word.Selection.HomeKey([Microsoft.Office.Interop.Word.WdUnits]::wdStory) | Out-Null
    $shape = $word.Selection.InlineShapes.AddPicture((Resolve-Path $imagePath).Path, $false, $true)
    
    # Dimensions A4
    $pageWidthPoints = 595.28
    $pageHeightPoints = 841.89
    
    $shape.LockAspectRatio = [Microsoft.Office.Core.MsoTriState]::msoFalse
    $shape.Width = $pageWidthPoints
    $shape.Height = $pageHeightPoints
    
    Write-Host "Image inseree: ${pageWidthPoints}x${pageHeightPoints} pts" -ForegroundColor Green
    
    # Centrer l'image
    $word.Selection.HomeKey([Microsoft.Office.Interop.Word.WdUnits]::wdStory) | Out-Null
    $word.Selection.ParagraphFormat.Alignment = [Microsoft.Office.Interop.Word.WdParagraphAlignment]::wdAlignParagraphCenter
    
    # Supprimer le numéro de page de la section 1
    Write-Host "Suppression numero de page section 1..." -ForegroundColor Yellow
    $footer1 = $section1.Footers.Item(1)
    $footer1.LinkToPrevious = $false
    if ($footer1.Range.Text.Trim() -ne "") {
        $footer1.Range.Delete() | Out-Null
    }
    
    # Vérifier le nombre de pages final
    $finalPageCount = $doc.ComputeStatistics(2)
    $finalSectionCount = $doc.Sections.Count
    
    Write-Host ""
    Write-Host "Pages finales: $finalPageCount (initial: $initialPageCount)" -ForegroundColor Cyan
    Write-Host "Sections finales: $finalSectionCount" -ForegroundColor Cyan
    
    if ($finalPageCount -eq $initialPageCount) {
        Write-Host "PARFAIT: Nombre de pages inchange !" -ForegroundColor Green
    } else {
        $diff = $finalPageCount - $initialPageCount
        Write-Host "ATTENTION: Difference de pages: $diff" -ForegroundColor Yellow
    }
    
    # Sauvegarder
    $doc.Save()
    $doc.Close()
    $word.Quit()
    
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($shape) | Out-Null
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($footer1) | Out-Null
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($section1) | Out-Null
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($doc) | Out-Null
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
    
    Write-Host ""
    Write-Host "=== TERMINE ===" -ForegroundColor Green
    
} catch {
    Write-Host "ERREUR: $_" -ForegroundColor Red
    if ($doc) { $doc.Close([ref]$false) }
    if ($word) { $word.Quit() }
    exit 1
}

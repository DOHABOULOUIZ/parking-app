# Script pour supprimer la page supplémentaire (page 4) qui a été ajoutée

$docPath = "Rapport de Stage -f-f.docx"

Write-Host "=== Suppression de la page supplementaire ===" -ForegroundColor Cyan

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupPath = "Rapport de Stage -f-f_backup_CLEANUP_$timestamp.docx"
Copy-Item $docPath $backupPath
Write-Host "Backup: $backupPath" -ForegroundColor Green

try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    
    $doc = $word.Documents.Open((Resolve-Path $docPath).Path)
    
    $initialPageCount = $doc.ComputeStatistics(2)
    Write-Host "Pages initiales: $initialPageCount" -ForegroundColor Cyan
    
    # Aller à la page 4
    Write-Host "Navigation vers page 4..." -ForegroundColor Yellow
    $word.Selection.GoTo([Microsoft.Office.Interop.Word.WdGoToItem]::wdGoToPage, 
                         [Microsoft.Office.Interop.Word.WdGoToDirection]::wdGoToAbsolute, 
                         4) | Out-Null
    
    # Sélectionner toute la page 4
    $word.Selection.Bookmarks.Item("\page").Select()
    
    # Afficher le contenu pour vérifier
    $pageText = $word.Selection.Text
    $preview = $pageText.Trim().Substring(0, [Math]::Min(60, $pageText.Trim().Length))
    Write-Host "Contenu page 4: '$preview...'" -ForegroundColor Yellow
    
    # Vérifier si c'est bien la page problématique
    if ($pageText -match "Rapport de Stage.*Doha Boulouiz") {
        Write-Host "Page problematique detectee - SUPPRESSION..." -ForegroundColor Red
        $word.Selection.Delete() | Out-Null
        Write-Host "Page 4 supprimee" -ForegroundColor Green
    } else {
        Write-Host "ATTENTION: Page 4 ne correspond pas au pattern attendu" -ForegroundColor Yellow
        Write-Host "Abandon de la suppression pour eviter de perdre du contenu" -ForegroundColor Yellow
    }
    
    $finalPageCount = $doc.ComputeStatistics(2)
    Write-Host ""
    Write-Host "Pages finales: $finalPageCount (initial: $initialPageCount)" -ForegroundColor Cyan
    
    if ($finalPageCount -eq ($initialPageCount - 1)) {
        Write-Host "SUCCES: 1 page supprimee" -ForegroundColor Green
    } elseif ($finalPageCount -eq $initialPageCount) {
        Write-Host "Aucune page supprimee" -ForegroundColor Yellow
    }
    
    $doc.Save()
    $doc.Close()
    $word.Quit()
    
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
}

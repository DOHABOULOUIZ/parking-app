# Script minimal pour corriger la numérotation SANS ajouter de pages
# Approche: Supprimer seulement le numéro de la section 1 (page de garde)

$docPath = "Rapport de Stage -f-f.docx"

Write-Host "=== Correction minimale de la numerotation ===" -ForegroundColor Cyan

if (-not (Test-Path $docPath)) {
    Write-Host "ERREUR: Document non trouve" -ForegroundColor Red
    exit 1
}

# Backup
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupPath = "Rapport de Stage -f-f_backup_nummin_$timestamp.docx"
Copy-Item $docPath $backupPath
Write-Host "Backup cree: $backupPath" -ForegroundColor Green

try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    
    Write-Host "Ouverture du document..." -ForegroundColor Yellow
    $doc = $word.Documents.Open((Resolve-Path $docPath).Path)
    
    $initialPageCount = $doc.ComputeStatistics(2)
    Write-Host "Pages initiales: $initialPageCount" -ForegroundColor Cyan
    Write-Host "Sections: $($doc.Sections.Count)" -ForegroundColor Cyan
    
    # Section 1 UNIQUEMENT : Supprimer la numérotation de page
    Write-Host "Section 1: Suppression numerotation page de garde..." -ForegroundColor Yellow
    $section1 = $doc.Sections.Item(1)
    $footer1 = $section1.Footers.Item(1)  # wdHeaderFooterPrimary = 1
    
    # Ne pas lier au précédent
    $footer1.LinkToPrevious = $false
    
    # Supprimer le contenu du pied de page (numéro)
    if ($footer1.Range.Text.Trim() -ne "") {
        $footer1.Range.Delete() | Out-Null
        Write-Host "Numero supprime de la page de garde" -ForegroundColor Green
    } else {
        Write-Host "Page de garde n'avait deja pas de numero" -ForegroundColor Gray
    }
    
    # Ne PAS toucher aux autres sections - laisser la numérotation existante
    
    $finalPageCount = $doc.ComputeStatistics(2)
    Write-Host "Pages finales: $finalPageCount" -ForegroundColor Cyan
    
    if ($finalPageCount -eq $initialPageCount) {
        Write-Host "SUCCES: Nombre de pages inchange ($finalPageCount)" -ForegroundColor Green
    } else {
        Write-Host "ATTENTION: Pages changees: $initialPageCount -> $finalPageCount" -ForegroundColor Yellow
    }
    
    Write-Host "Sauvegarde..." -ForegroundColor Yellow
    $doc.Save()
    
    $doc.Close()
    $word.Quit()
    
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
}

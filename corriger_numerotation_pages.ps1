# Script pour corriger la numérotation des pages dans le rapport Word
# Créé le 19/04/2026

$docPath = Join-Path $PSScriptRoot "Rapport de Stage -f-.docx"

if (-not (Test-Path $docPath)) {
    Write-Host "ERREUR: Document introuvable!" -ForegroundColor Red
    exit 1
}

Write-Host "=== Correction de la numerotation des pages ===" -ForegroundColor Cyan

try {
    # Créer une sauvegarde
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupPath = $docPath -replace '\.docx$', "_backup_numerotation_$timestamp.docx"
    Copy-Item -Path $docPath -Destination $backupPath -Force
    Write-Host "Sauvegarde creee: $backupPath" -ForegroundColor Green
    
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    
    Write-Host "Ouverture du document..." -ForegroundColor Yellow
    $doc = $word.Documents.Open($docPath)
    
    Write-Host "Nombre de sections dans le document: $($doc.Sections.Count)" -ForegroundColor Gray
    
    # Parcourir toutes les sections et vérifier/corriger la numérotation
    for ($i = 1; $i -le $doc.Sections.Count; $i++) {
        $section = $doc.Sections.Item($i)
        
        # Vérifier le pied de page
        $footer = $section.Footers.Item([Microsoft.Office.Interop.Word.WdHeaderFooterIndex]::wdHeaderFooterPrimary)
        
        if ($i -eq 1) {
            # Section 1 (page de garde) : pas de numérotation
            Write-Host "Section $i (page de garde): Suppression de la numerotation..." -ForegroundColor Yellow
            $footer.PageNumbers.RestartNumberingAtSection = $false
            $footer.PageNumbers.StartingNumber = 0
        } else {
            # Sections suivantes : continuer la numérotation
            Write-Host "Section $i : Configuration numerotation continue..." -ForegroundColor Yellow
            
            # Lier au pied de page précédent pour continuer la numérotation
            $footer.LinkToPrevious = $true
            
            # NE PAS redémarrer la numérotation
            $section.PageSetup.RestartPageNumbering = $false
        }
    }
    
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
    Write-Host "=== SUCCES ===" -ForegroundColor Green
    Write-Host "La numerotation des pages a ete corrigee!" -ForegroundColor Green
    Write-Host "Les pages devraient maintenant etre numerotees correctement: 1, 2, 3, 4..." -ForegroundColor Green
    
} catch {
    Write-Host ""
    Write-Host "ERREUR:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($doc) { $doc.Close($false) }
    if ($word) { $word.Quit() }
    
    exit 1
}
